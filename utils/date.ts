export default class getDates {
  getMilisecondsDate = (days: number) => days * 24 * 60 * 60 * 1000;
  getDate = (days: number) => {
    const date = new Date();
    const currentDate = date.toISOString();
    return [
      new Date(date.getTime() - this.getMilisecondsDate(days)).toISOString(),
      currentDate,
    ];
  };
};
