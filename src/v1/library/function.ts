export class Functions {
  constructor() {}

  output(status_code: number, status_message: any, data: any = null) {
    //const dateFormat = (await import('dateformat')).default;

    console.log("Data", data);
    let output = {
      status_code: status_code.toString(),
      status_message: status_message,
      // datetime: dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss"),
      data: data,
    };
    console.log("output", output);

    return output;
  }
}
