import RegisterComponent from './register-component';
import { NewCustomer } from '../../shared/types/customers-type';
import ApiSignUp from '../../services/registration/api-registration';
import EventEmitter from '../../shared/util/emitter';

export default class Registration extends RegisterComponent {
  constructor(emitter: EventEmitter) {
    super(emitter);
    this.subRegistration();
  }

  private subRegistration() {
    this.emitter.subscribe('submitRegistr', (customerObj: NewCustomer) => this.createCustomer(customerObj));
  }

  private createCustomer = async (customerObj: NewCustomer): Promise<void> => {
    try {
      const response = await ApiSignUp.apiRoot
        .customers()
        .post({
          body: customerObj,
        })
        .execute();
      console.log(response.statusCode, 'response.statusCode');

      console.log(response.statusCode, 'response.statusCode');
      const customerID = response.body.customer.id;
      this.emitter.emit('successfulRegistr', undefined);
      console.log('customerID', customerID);
      console.log('customerNEW', response);
    } catch (err) {
      if (err instanceof Error) {
        this.emitter.emit('failedRegistr', undefined);
        console.log('🙀🙀🙀🙀🙀🙀🙀🙀🙀 customer cannot be created, because', err.message);
      }
    }
  };
}
