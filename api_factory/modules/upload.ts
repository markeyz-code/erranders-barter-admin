import { GATEWAY_ENDPOINT } from '../axios.config';
export const uploadApi = {
  image: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return GATEWAY_ENDPOINT.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  video: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return GATEWAY_ENDPOINT.post('/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};