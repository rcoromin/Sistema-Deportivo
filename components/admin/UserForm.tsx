import React, { useEffect, useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface UserFormProps {
  editingUser: any;
  onSaved: () => void;
  onError?: (msg?: string) => void;
}

const tipos = [
  { id: 1, nombre: 'invitado' },
  { id: 2, nombre: 'usuario' },
  { id: 3, nombre: 'administrador' },
];

const UserForm: React.FC<UserFormProps> = ({ editingUser, onSaved, onError }) => {
  const [form, setForm] = useState({
    nombre_usuario: '',
    correo: '',
    contraseña: '',
    nombre_empresa: '',
    id_tipo_usuario: 2,
    activo: 1,
  });
  const [errors, setErrors] = useState<{[key:string]: string}>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (editingUser) {
      setForm({
        nombre_usuario: editingUser.nombre_usuario || '',
        correo: editingUser.correo || '',
        contraseña: '',
        nombre_empresa: editingUser.nombre_empresa || '',
        id_tipo_usuario: editingUser.id_tipo_usuario ?? 2,
        activo: editingUser.activo ?? 1,
      });
    } else {
      setForm({ nombre_usuario: '', correo: '', contraseña: '', nombre_empresa: '', id_tipo_usuario: 2, activo: 1 });
    }
  }, [editingUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'number' || name === 'id_tipo_usuario' || name === 'activo' ? Number(value) : value || ''
    }));
    setErrors(errs => ({ ...errs, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    // Validación simple
    const newErrors: {[key:string]: string} = {};
    if (!form.nombre_usuario) newErrors.nombre_usuario = 'El nombre es obligatorio';
    if (!form.correo) newErrors.correo = 'El correo es obligatorio';
  if (!editingUser && !form.contraseña) newErrors.contraseña = 'La contraseña es obligatoria';
    if (form.correo && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.correo)) newErrors.correo = 'Correo inválido';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const adminId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id_usuario : null;
    if (!adminId) return;
    try {
      let res;
      if (editingUser && editingUser.id_usuario) {
        // Actualizar usuario (sin contraseña)
        const { contraseña, ...formSinPassword } = form;
        res = await fetch(`http://127.0.0.1:5000/usuarios/${editingUser.id_usuario}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-User-Id': adminId },
          body: JSON.stringify(formSinPassword)
        });
      } else {
        // Crear usuario
        res = await fetch('http://127.0.0.1:5000/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-User-Id': adminId },
          body: JSON.stringify(form)
        });
      }
      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error || 'Error al guardar');
        if (onError) onError(data.error || 'Error al guardar');
        return;
      }
      onSaved();
    } catch (err) {
      setSubmitError('Error de red o servidor');
      if (onError) onError('Error de red o servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-200 dark:border-gray-700 relative">
      {submitError && (
        <div className="absolute -top-8 left-0 w-full bg-red-500 text-white text-center py-2 rounded-t-lg flex items-center justify-center gap-2">
          <InformationCircleIcon className="w-5 h-5" />
          {submitError}
        </div>
      )}
      <div className="flex flex-col gap-1 col-span-1">
        <label htmlFor="nombre_usuario" className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
          Nombre de usuario
          <span className="text-xs text-gray-400" title="Nombre único para el usuario">ⓘ</span>
        </label>
        <input
          id="nombre_usuario"
          name="nombre_usuario"
          value={form.nombre_usuario ?? ''}
          onChange={handleChange}
          placeholder="Nombre de usuario"
          className={`input ${errors.nombre_usuario ? 'border-red-500 ring-2 ring-red-400' : ''}`}
          required
          title="Nombre único para el usuario"
        />
        {errors.nombre_usuario && <span className="text-red-500 text-xs">{errors.nombre_usuario}</span>}
      </div>
      <div className="flex flex-col gap-1 col-span-1">
        <label htmlFor="correo" className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
          Correo
          <span className="text-xs text-gray-400" title="Correo electrónico válido">ⓘ</span>
        </label>
        <input
          id="correo"
          name="correo"
          value={form.correo ?? ''}
          onChange={handleChange}
          placeholder="Correo"
          className={`input ${errors.correo ? 'border-red-500 ring-2 ring-red-400' : ''}`}
          required
          type="email"
          title="Correo electrónico válido"
        />
        {errors.correo && <span className="text-red-500 text-xs">{errors.correo}</span>}
      </div>
      {!editingUser && (
        <div className="flex flex-col gap-1 col-span-1">
          <label htmlFor="contraseña" className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
            Contraseña
            <span className="text-xs text-gray-400" title="Mínimo 6 caracteres">ⓘ</span>
          </label>
          <input
            id="contraseña"
            name="contraseña"
            value={form.contraseña ?? ''}
            onChange={handleChange}
            placeholder="Contraseña"
            className={`input ${errors.contraseña ? 'border-red-500 ring-2 ring-red-400' : ''}`}
            type="password"
            required
            title="Mínimo 6 caracteres"
          />
          {errors.contraseña && <span className="text-red-500 text-xs">{errors.contraseña}</span>}
        </div>
      )}
      <div className="flex flex-col gap-1 col-span-1">
        <label htmlFor="nombre_empresa" className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
          Empresa
          <span className="text-xs text-gray-400" title="Nombre de la empresa (opcional)">ⓘ</span>
        </label>
        <input
          id="nombre_empresa"
          name="nombre_empresa"
          value={form.nombre_empresa ?? ''}
          onChange={handleChange}
          placeholder="Empresa"
          className="input"
          title="Nombre de la empresa (opcional)"
        />
      </div>
      <div className="flex flex-col gap-1 col-span-1">
        <label htmlFor="id_tipo_usuario" className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
          Tipo de usuario
          <span className="text-xs text-gray-400" title="Rol del usuario">ⓘ</span>
        </label>
        <select
          id="id_tipo_usuario"
          name="id_tipo_usuario"
          value={form.id_tipo_usuario ?? 2}
          onChange={handleChange}
          className="input"
          title="Rol del usuario"
        >
          {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-1 col-span-1">
        <label htmlFor="activo" className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
          Estado
          <span className="text-xs text-gray-400" title="Activo o desactivado">ⓘ</span>
        </label>
        <select
          id="activo"
          name="activo"
          value={form.activo ?? 1}
          onChange={handleChange}
          className="input"
          title="Activo o desactivado"
        >
          <option value={1}>Activo</option>
          <option value={0}>Desactivado</option>
        </select>
      </div>
      <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mt-2">{editingUser ? 'Actualizar' : 'Crear'} usuario</button>
    </form>
  );
};

export default UserForm;
