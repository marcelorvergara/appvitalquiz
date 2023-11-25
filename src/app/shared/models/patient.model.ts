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
  tests_results?: TestResults;
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

interface TestResults {
  mapValue: MapValue;
}

export interface MapValue {
  fields: DateFields;
}

export interface DateFields {
  [k: string]: DateOfTest;
}

export interface DateOfTest {
  arrayValue: ArrayValue;
}

export interface ArrayValue {
  values: Value[];
}

export interface Value {
  integerValue: string;
}
