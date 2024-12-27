import { ITagsSwagger } from '../types/tags-swagger';

const DEFINE_TAGS_NAME = {
  AUTH: 'Auth',
};

const DEFINE_TAGS: ITagsSwagger[] = [
  {
    name: DEFINE_TAGS_NAME.AUTH,
    description: 'Các endpoint sử dụng để xác thực người dùng',
  },
];

export { DEFINE_TAGS, DEFINE_TAGS_NAME };
