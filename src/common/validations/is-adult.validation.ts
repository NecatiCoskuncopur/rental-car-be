import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsAdultConstraint implements ValidatorConstraintInterface {
  validate(dateOfBirth: string) {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) return false;

    const today = new Date();
    const adultDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );

    return dob <= adultDate;
  }

  defaultMessage(): string {
    return 'User must be at least 18 years old.';
  }
}

export function IsAdult(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAdultConstraint,
    });
  };
}
