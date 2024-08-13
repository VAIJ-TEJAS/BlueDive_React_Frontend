import { Modal } from 'antd';

export const confirmation = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const handleConfirm = () => {
      resolve(true);
      modal.destroy();
    };

    const handleCancel = () => {
      resolve(false);
      modal.destroy();
    };

    const modal = Modal.confirm({
      title: 'Confirmation',
      content: message,
      onOk: handleConfirm,
      onCancel: handleCancel,
      okButtonProps: {
        className: 'bg-primary',
      },
      okText: 'Yes',
      cancelText: 'Cancel',
    });
  });
};