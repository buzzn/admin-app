import React from 'react';

export default ({ group, url, summedData, loading, setData, setLoading, setLoaded, Bubbles, InfoPanel }) => (
  <div className="bubbles-wrapper row">
    <div className="col-6">
      <div className="row">
        <div className="col-12">
          <InfoPanel type="in" data={ summedData.in } />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <InfoPanel type="out" data={ summedData.out } />
        </div>
      </div>
    </div>
    <div className="col-6">
      <div className="panel" style={{ position: 'relative' }}>
        <div style={{ width: '100%', height: '160px', display: 'inline-block', position: 'relative' }}>
          { !!group &&
          <Bubbles
            key={ group }
            url={ url }
            group={ group }
            setData={ setData }
            setLoading={ setLoading }
            setLoaded={ setLoaded } />
          }
        </div>
        <div className="basic-loading" style={{
          width: '100%',
          height: '100%',
          display: 'inline-block',
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: loading ? 10 : -10,
          background: 'rgba(255, 255, 255, 0.7)',
        }}>
          <div style={{ color: 'grey', fontSize: '18px', fontWeight: 'bolder', marginLeft: '30%', marginTop: '25%' }}>
            Loading...
          </div>
        </div>
      </div>
    </div>
  </div>
);
