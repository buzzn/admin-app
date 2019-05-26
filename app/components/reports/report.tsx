import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';

import { EegReportStruct } from 'reports';

interface Props {
  groupId: string;
  report: EegReportStruct;
}

const Report: React.FC<Props> = ({ groupId, report: { _status, warnings, ...fields } }) => (
  <div>
    {!!warnings.length && (
      <ul>
        {warnings.map(e => (
          <li key={`${e.meterId}-${e.registerId}`}>
            <Link to={`/groups/${groupId}/market-locations/registers/${e.meterId}/${e.registerId}/readings`}>
              {e.reason}
            </Link>
          </li>
        ))}
      </ul>
    )}
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
