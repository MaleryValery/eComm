import Toastify from 'toastify-js';
import '../styles/toastify.css';

type MessageType = 'fail' | 'success';

export default class ApiMessageHandler {
  private static createMessage(message: string, type: MessageType) {
    return {
      stopOnFocus: true,
      text: message,
      duration: 2000,
      className: `toastify-${type} toastify-top toastify-center`,
    };
  }

  public static showMessage(message: string, type: MessageType) {
    switch (message) {
      case 'Failed to fetch':
        Toastify(this.createMessage('No connection', 'fail')).showToast();
        break;
      case 'There is already an existing customer with the provided email.':
        Toastify(this.createMessage('Customet with provided email exists, please login', 'fail')).showToast();
        break;

      default:
        Toastify(this.createMessage(message, type)).showToast();
    }
  }
}
