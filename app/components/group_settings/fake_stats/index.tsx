import React, { useState } from 'react';
import Alert from 'react-s-alert';

const FakeStats = ({ group, updateGroup }) => {
  const [editMode, setEditMode] = useState(false);
  const [fakeStats, setFakeStats] = useState({});
  if (!Object.keys(fakeStats).length && group.fakeStats && Object.keys(group.fakeStats).length) setFakeStats(group.fakeStats);
  const fields = [
    'nuclearRatio',
    'coalRatio',
    'gasRatio',
    'otherFossilesRatio',
    'renewablesEegRatio',
    'otherRenewablesRatio',
    'co2EmissionGrammPerKwh',
    'nuclearWasteMiligrammPerKwh',
    'renterPowerEeg',
  ];

  const handleSave = () => new Promise((resolve, reject) => {
    updateGroup({
      groupId: group.id,
      resolve,
      reject,
      params: { fakeStats: JSON.stringify(fakeStats), updatedAt: group.updatedAt },
    });
  }).then((res) => {
    // @ts-ignore
    Alert.success(JSON.stringify(res.fake_stats));
    setEditMode(false);
  });

  return (
    <div>
      {fields.map(fieldName => (
        <div key={fieldName}>
          <input
            disabled={!editMode}
            type="text"
            value={fakeStats[fieldName] || ''}
            onChange={({ target: { value } }) => setFakeStats({ ...fakeStats, [fieldName]: value })}
          />
          <label>{fieldName}</label>
        </div>
      ))}
      {editMode ? (
        <React.Fragment>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </React.Fragment>
      ) : (
        <button onClick={() => setEditMode(true)}>Edit</button>
      )}
    </div>
  );
};

export default FakeStats;
