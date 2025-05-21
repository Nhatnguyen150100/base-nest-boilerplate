import { ITagsSwagger } from '../types';

const DEFINE_TAGS_NAME = {
  AUTH: 'Auth',
  UPLOAD: 'Upload',
  HEALTH: 'Health',
  USER: 'User',
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
  {
    name: DEFINE_TAGS_NAME.USER,
    description: 'Các endpoint sử dụng để quản lý người dùng',
  },
];

export { DEFINE_TAGS, DEFINE_TAGS_NAME };
