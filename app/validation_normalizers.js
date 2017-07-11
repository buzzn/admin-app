import moment from 'moment';

export const dateNormalizer = format => value => moment(value).format(format);
