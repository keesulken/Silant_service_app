import React from 'react';
import { useParams } from 'react-router-dom';

export default function Machine() {
  let { machineId } = useParams();

  return (
    <div>Machine {machineId}</div>
  )
}
