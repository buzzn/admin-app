import * as React from 'react';
import MeterDataForm from './form';
import { BreadcrumbsProps } from 'components/breadcrumbs';
import { CenterContent } from 'components/style';
import PageTitle from 'components/page_title';

interface Props {
  url: string;
  meter: any;
  realValidationRules: any;
  virtualValidationRules: any;
}

const MeterData = ({
  url,
  breadcrumbs,
  meter,
  realValidationRules,
  virtualValidationRules,
}: Props & BreadcrumbsProps) => (
  <React.Fragment>
    <PageTitle
      {...{
        breadcrumbs: breadcrumbs.concat([
          {
            id: meter.id,
            type: 'meter',
            title: meter.productSerialnumber,
            link: undefined,
          },
        ]),
        url,
        title: `Meter ${meter.productSerialnumber}`,
      }}
    />
    <CenterContent>
      <MeterDataForm {...{ meter, realValidationRules, virtualValidationRules, initialValues: meter }} />
    </CenterContent>
  </React.Fragment>
);

export default MeterData;
