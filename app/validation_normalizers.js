import moment from 'moment';

export const dateNormalizer = format => value => moment(value).format(format);

export const numberNormalizer = value => (!isNaN(Number(parseFloat(value))) ? parseFloat(value) : undefined);
