export interface IMember {
  name: string;
  congregated: boolean;
}

export interface IMemberState extends IMember {
  id: string;
}
