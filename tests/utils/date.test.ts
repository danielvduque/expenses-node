import getDates from '../../utils/date';

const getFirstPartOfDate = (date:string) => {
    return date.split('T').at(0);
}

describe("All date tests", () => {

    test('Get expected miliseconds', () => {
        const dates = new getDates();
        expect(dates.getMilisecondsDate(1)).toEqual(86400000);
    });

    test('Get notNaN date', () => {
        const dates = new getDates();
        expect(dates.getDate(1)[0]).not.toBeNaN();
    });

    test('Get actual date', () => {
        const dates = new getDates();
        const current = dates.getDate(0).at(1);
        expect(getFirstPartOfDate(current)).toEqual(getFirstPartOfDate(new Date().toISOString()))
    })

});
