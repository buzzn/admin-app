import moment from 'moment';

export const dateNormalizer = format => value => moment(value).format(format);

export const numberNormalizer = value => (parseFloat(value) || undefined);
