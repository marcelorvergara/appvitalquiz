export interface Patient {
  nome: string;
  email: string;
  phone: string;
}

export interface Patients {
  documents: PatientsDoc[];
}

export interface PatientsDoc {
  name: string;
  fields: Fields;
  createTime: string;
  updateTime: string;
}

interface Fields {
  phone: Phone;
  nome: Nome;
  email: Email;
  contact: Contact;
  test_number?: TestNumber;
  tests_results?: any;
}

interface Phone {
  stringValue: string;
}

interface Nome {
  stringValue: string;
}

interface Email {
  stringValue: string;
}

interface TestNumber {
  stringValue: string;
}

interface Contact {
  stringValue: string;
}
