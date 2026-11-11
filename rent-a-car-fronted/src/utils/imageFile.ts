import i18n from '../i18n';

// Seçilmiş şəkil faylını (maks. 5MB) base64 mətninə çevirir
export const readImageFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    if (file.size > 5 * 1024 * 1024) return reject(new Error(i18n.t('adminCars.imageTooBig')));
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(i18n.t('adminCars.imageReadFail')));
    reader.readAsDataURL(file);
  });
