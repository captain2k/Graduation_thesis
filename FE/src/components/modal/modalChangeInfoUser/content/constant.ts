import getBase64 from "@/utils/file";
import { RangePickerProps } from "antd/es/date-picker";
import moment from "moment";
import lodash from 'lodash';
import { ORIGIN_UPLOAD } from "@/constants/index";
import { deleteFileS3, uploadFileS3 } from "@/utils/aws";

export const handleGetURL = async (file) => {
  if (!file) return null;
  const imageURL = (file.url) && file.origin === ORIGIN_UPLOAD.AWS ? file.url : await getBase64(file.originFileObj);
  return imageURL;
};

export const handleSetImage = (FileList, setValue) => {
  if (lodash.isEmpty(FileList)) return;

  const [imageEnabled] = FileList.length === 1 ? FileList : FileList.filter((item) => {
    return item.is_delete === false;
  });

  if (!imageEnabled) return;

  // eslint-disable-next-line
  //@ts-ignore
  return new Promise(async (resolve, reject) => {
    const imageURL = await handleGetURL(imageEnabled);
    setValue(imageURL);
  });
};

export const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  const today = moment();
  // Trả về true nếu current là ngày trong tương lai
  return current && current > today;
};

export const optionRole = [
  { value: "1", label: "Admin" },
  { value: "2", label: "User" },
  { value: "3", label: "Shipper" },
]

export const optionGender = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
  { value: "3", label: "Other" },
]

export const handlePrevImageS3 = async (fileList) => {
  const classifyImage = fileList.reduce(
    (current, next) => {
      if (next.is_delete && next.origin === ORIGIN_UPLOAD.AWS) {
        current.ImageDelete.push(next);
      }

      if (next.is_delete === false && next.origin === ORIGIN_UPLOAD.NORMAL) {
        current.ImageUpload.push(next);
      }

       // eslint-disable-next-line
      if ((next.is_delete === false || !next.hasOwnProperty('is_delete')) && next.origin === ORIGIN_UPLOAD.AWS) {
        current.imageUPloaded.push(next);
      }

      return current;
    },
    { ImageDelete: [], ImageUpload: [], imageUPloaded: [] }
  );
  const { ImageDelete, ImageUpload, imageUPloaded } = classifyImage;

  ImageDelete.forEach((image) => {
    if (image.url) deleteFileS3(image.name);
  });

  if (!lodash.isEmpty(ImageUpload)) {
    const [imageUpload] = ImageUpload;

    const nameAvatar = `${moment().format("YYYY-MM-DD HH:MM:ss")}_${imageUpload.name
      }`;

    const avatar_S3 = await uploadFileS3(
      imageUpload.originFileObj,
      nameAvatar
    );

    return JSON.stringify({
      url: avatar_S3?.Location,
      name: avatar_S3?.key,
      origin: "aws",
    });
  }

  if(!lodash.isEmpty(imageUPloaded)) {
    const [imageOlder] = imageUPloaded;

    return JSON.stringify(imageOlder);
  }

  return '[]';
};

export const handleMultiPrevImageS3 = async (fileList) => {
  const classifyImage = fileList.reduce(
    (current, next) => {
      if (next.is_delete && next.origin === ORIGIN_UPLOAD.AWS) {
        current.ImageDelete.push(next);
      }

      if (next.is_delete === false && next.origin === ORIGIN_UPLOAD.NORMAL) {
        current.ImageUpload.push(next);
      }

       // eslint-disable-next-line
      if ((next.is_delete === false || !next.hasOwnProperty('is_delete')) && next.origin === ORIGIN_UPLOAD.AWS) {
        current.imageUPloaded.push(next);
      }

      return current;
    },
    { ImageDelete: [], ImageUpload: [], imageUPloaded: [] }
  );
  const { ImageDelete, ImageUpload, imageUPloaded } = classifyImage;

  ImageDelete.forEach((image) => {
    if (image.url) deleteFileS3(image.name);
  });

  if (!lodash.isEmpty(ImageUpload)) {

    const result = await Promise.all(ImageUpload.map(async (image) => {
      const nameAvatar = `${moment().format("YYYY-MM-DD HH:MM:ss")}_${image.name}`;
      const avatar_S3 = await uploadFileS3(image.originFileObj, nameAvatar);
      return {
        url: avatar_S3?.Location,
        name: avatar_S3?.key,
        origin: "aws",
      };
    }));

    return [...imageUPloaded, ...result];
  }

  return imageUPloaded;
}