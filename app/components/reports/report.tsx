import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import { EegReportStruct } from 'reports';

interface Props {
  report: EegReportStruct;
}

const Report: React.FC<Props> = ({ report: { _status, warnings, ...fields } }) => (
  <div>
    {!!warnings.length && <pre>{JSON.stringify(warnings, null, 2)}</pre>}
    {Object.keys(fields).map(key => (
      <div key={key}>
        <span>
          <FormattedMessage id={`admin.reports.${key}`} />
        </span>
        :{' '}
        <span>
          <FormattedNumber {...{ style: 'decimal', value: fields[key] / 1000 }} />
        </span>
      </div>
    ))}
  </div>
);

export default Report;
