import { ITagsSwagger } from '../types';

const DEFINE_TAGS_NAME = {
  AUTH: 'Auth',
  UPLOAD: 'Upload',
  HEALTH: 'Health',
};

const DEFINE_TAGS: ITagsSwagger[] = [
  {
    name: DEFINE_TAGS_NAME.AUTH,
    description: 'Các endpoint sử dụng để xác thực người dùng',
  },
  {
    name: DEFINE_TAGS_NAME.UPLOAD,
    description: 'Các endpoint sử dụng để upload file',
  },
  {
    name: DEFINE_TAGS_NAME.HEALTH,
    description: 'Các endpoint sử dụng để kiểm tra tình trạng của ứng dụng',
  },
];

export { DEFINE_TAGS, DEFINE_TAGS_NAME };
