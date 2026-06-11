export interface UniversityRegistrationPayload {
  registrationId: string;
  submittedAt: string;
  course: {
    slug: string;
    title: string;
  };
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  email: string;
  phone: string;
  message: string;
}

export interface UniversityRegistrationInput {
  course: {
    slug: string;
    title: string;
  };
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  email: string;
  phone: string;
  message?: string;
}
