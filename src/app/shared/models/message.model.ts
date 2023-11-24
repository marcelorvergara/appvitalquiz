export interface ReturnedFromMessageSent {
  body: string;
  numSegments: string;
  direction: string;
  from: string;
  to: string;
  dateUpdated: string;
  price: any;
  errorMessage: any;
  uri: string;
  accountSid: string;
  numMedia: string;
  status: string;
  messagingServiceSid: any;
  sid: string;
  dateSent: any;
  dateCreated: string;
  errorCode: any;
  priceUnit: any;
  apiVersion: string;
  subresourceUris: SubresourceUris;
}

export interface SubresourceUris {
  media: string;
}
