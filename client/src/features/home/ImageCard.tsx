import { gql, useMutation } from "@apollo/client";
import { Edit2 } from "iconsax-react";
import React, { ChangeEvent, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import LoadingCard from "../../components/LoadingCard";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import useUser from "../../hooks/useUser";
import {
  handleClose,
  handleOpen,
  selectPopup,
} from "../../redux/features/popupSlice";
import { toBase64 } from "../../utils/toBase64";

const UpdateMutation = gql`
  mutation UpdatePhotoUrl($file: Upload!) {
    updatePhotoUrl(file: $file) {
      message
    }
  }
`;

interface Props {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  file: File | null;
}

const ImageCard = ({ file, setFile }: Props) => {
  const dispatch = useDispatch();
  const popUpState = useSelector(selectPopup);
  const { user } = useSelector((store: any) => store.user);
  const ref = useRef<HTMLDivElement>(null);

  const [updatePhotoUrl, { loading }] = useMutation(UpdateMutation);

  const { getUser } = useUser(true);

  const close = () => dispatch(handleClose());

  useOnClickOutside(ref, close);

  const handleSubmit = async () => {
    await updatePhotoUrl({
      variables: {
        file,
      },
      onCompleted: (data) => {
        getUser({
          onCompleted: () => {
            setFile(null);
            close();
          },
        });
      },
      onError: (err) => console.table(err),
    });
  };

  return (
    <div className="fixed top-0 w-full h-full z-[999999] bg-black/50 grid place-items-center">
      <div
        ref={ref}
        className="w-[300px] h-[200px] bg-white dark:bg-dark rounded-xl shadow dark:shadow-black grid place-items-center"
      >
        {!loading ? (
          <>
            <div className="relative w-[100px] h-[100px]">
              <Avatar
                src={popUpState?.data}
                className="rounded-full w-[100px] h-[100px] relative"
                alt=""
              />

              <label
                htmlFor="image"
                className="absolute bottom-1 right-1 w-[25px] h-[25px] bg-white dark:bg-dark shadow rounded-full flex items-center justify-center border-0 outline-0 active:scale-95 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <Edit2 size={20} className="text-black dark:text-white" />
              </label>
            </div>

            <div className="flex w-full items-center justify-center">
              <Button
                className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
                onClick={close}
              >
                Cancel
              </Button>
              <Button disabled={false} onClick={handleSubmit} className="">
                Submit
              </Button>
            </div>
          </>
        ) : (
          <LoadingCard title="Uploading..." />
        )}
      </div>
    </div>
  );
};

export default ImageCard;
