import React from 'react';
import { Link } from 'react-router-dom';

export default function UnauthMachine(props) {
  if (props.machine) {
    let machine = props.machine;
    return (
        <div>
            <p>Результат поиска</p>
            <p>Информация о технике</p>
            <table>
                <thead>
                    <tr>
                        <th>Зав. № машины</th>
                        <th>Модель техники</th>
                        <th>Модель двигателя</th>
                        <th>Зав. № двигателя</th>
                        <th>Модель трансмиссии</th>
                        <th>Зав. № трансмиссии</th>
                        <th>Модель ведущего моста</th>
                        <th>Зав. № ведущего моста</th>
                        <th>Модель управляемого моста</th>
                        <th>Зав. № управляемого моста</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{ machine.factory_number }</td>
                        <td><Link to={'/unit/' + machine.machine_model.pk}
                        >{ machine.machine_model.name }</Link></td>
                        <td><Link to={'/unit/' + machine.engine_model.pk}
                        >{ machine.engine_model.name }</Link></td>
                        <td>{ machine.engine_number }</td>
                        <td><Link to={'/unit/' + machine.transmission_model.pk}
                        >{ machine.transmission_model.name }</Link></td>
                        <td>{ machine.transmission_number }</td>
                        <td><Link to={'/unit/' + machine.drive_axle_model.pk}
                        >{ machine.drive_axle_model.name }</Link></td>
                        <td>{ machine.drive_axle_number }</td>
                        <td><Link to={'/unit/' + machine.steered_axle_model.pk}
                        >{ machine.steered_axle_model.name }</Link></td>
                        <td>{ machine.steered_axle_number }</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
  } else {
    return null;
  }
}
