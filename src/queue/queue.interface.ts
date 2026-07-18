 export interface Queue {
     publish(message: any): Promise<string>;
 }