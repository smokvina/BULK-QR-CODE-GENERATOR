
export enum InputMethod {
  Simple = 'SIMPLE',
  List = 'LIST',
}

export interface GeneratedQrCode {
  label: string;
  qrValue: string;
}
