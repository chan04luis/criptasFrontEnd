import React, {useState} from "react";
import { toast } from "react-toastify";
import GenericIndex from "../../../Utils/GenericIndex";
import GenericTable from "../../../Utils/GenericTable";
import GenericFilterForm from "../../../Utils/GenericFilterForm"; // Nuevo componente genérico de filtros
import { User, UserCreatePayload } from "../../../../entities/User";
import CreateUser from "./CreateUser";
import UserService from "../../../../services/UserService";

const ViewUsers = () => {
  const [currentUser, setCurrentUser] = useState<User  | UserCreatePayload >({
    Id:"",
    Nombres: "",
    Apellidos: "",
    Correo:  "",
    Contra: "",
    Telefono: "",
    Activo: true,
  });
  const initialFilters = {
    Id: "",
    Nombres: "",
    Apellidos: "",
    Correo: "",
    Estatus: true,
    numPag: 1,
    numReg: 10,
    field: "",
    byOrder: "",
  };

  const fetchUsers = async (filters: typeof initialFilters) => {
    try {
      const response = await UserService.getUsersByFilters(filters);
      if (response.HasError) {
        toast.error(response.Message);
        return null;
      }
      return {
        datos: response.Result || [],
        totalRegistros: response.Result.length,
        pagina: filters.numPag || 1,
      };
    } catch (error) {
      toast.error("Error al cargar los usuarios");
      return null;
    }
  };

  const handleCreateUser = async (onSave:() => void): Promise<void> => {
    try {
      const result = await UserService.createUser({
        ...currentUser,
        Correo: currentUser.Correo?.toLowerCase(),
      });

      if (result.HasError) {
        toast.error(result.Message || "Error al crear el usuario.");
      } else {
        onSave();
        toast.success("Usuario creado con éxito.");
      }
    } catch (error) {
      toast.error("Error al crear el usuario.");
      console.error(error);
    }
  };

  const handleEditUser = async (onSave:() => void): Promise<void> => {
    try {
      const result = await UserService.updateUser({
        Id: (currentUser as User).Id,
        Nombres: currentUser.Nombres,
        Apellidos: currentUser.Apellidos,
        Telefono: currentUser.Telefono,
      });

      if (result.HasError) {
        toast.error(result.Message || "Error al actualizar el usuario.");
      } else {
        onSave();
        toast.success("Usuario actualizado con éxito.");
      }
    } catch (error) {
      toast.error("Error al actualizar el usuario.");
      console.error(error);
    }
  };

  const handleDeleteUser = async (id: string): Promise<void> => {
    try {
      const response = await UserService.deleteUser(id);
      if (response.HasError) {
        toast.error(response.Message);
      } else {
        toast.success("Usuario eliminado con éxito");
      }
    } catch (error) {
      toast.error("Error al eliminar el usuario");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string): Promise<void> => {
    try {
      const payload = {
        Id: id,
        Estatus: newStatus === "Activo",
      };
      const response = await UserService.updateUserStatus(payload);
      if (response.HasError) {
        toast.error(response.Message);
      } else {
        toast.success("Estatus actualizado con éxito.");
      }
    } catch (error) {
      toast.error("Error al actualizar el estatus.");
      console.error(error);
    }
  };

  return (
    <GenericIndex<User, typeof initialFilters>
      title="Usuarios"
      titleModal="Usuario"
      user={currentUser}
      setUser={setCurrentUser}
      configuracion={{
        colorPrimary: "#1976d2",
        contrastePrimary: "#fff",
        colorSecundario: "#0d47a1",
        contrasteSecondario: "#fff",
      }}
      filtrosIniciales={initialFilters}
      fetchData={fetchUsers}
      insertData={handleCreateUser}
      updateData={handleEditUser}
      deleteData={handleDeleteUser}
      updateStatus={handleUpdateStatus}
      renderTable={(data, filtros, setFiltros, onEdit, onDelete, onUpdateStatus) => (
        <GenericTable<User>
          data={data.datos}
          columns={[
            { field: "Id", headerName: "Id", sortable: true, filterable:true },
            { field: "Nombres", headerName: "Nombres", sortable: true, filterable:true },
            { field: "Apellidos", headerName: "Apellidos", sortable: true, filterable:true },
            { field: "Correo", headerName: "Correo", sortable: true, filterable:true },
            { field: "Telefono", headerName: "Teléfono", sortable: true, filterable:true },
          ]}
          totalRecords={data.totalRegistros}
          pageSize={filtros.numReg}
          currentPage={filtros.numPag}
          onPageChange={(page) => setFiltros({ ...filtros, numPag: page })}
          onPageSizeChange={(size) =>
            setFiltros({ ...filtros, numReg: size, numPag: 1 })
          }
          filters={filtros}
          onFiltersChange={(newFilters) =>
            setFiltros((prevFilters) => ({
              ...prevFilters,
              ...newFilters,
            }))
          }
          onSortChange={(field, order) =>
            setFiltros({ ...filtros, field, byOrder: order })
          }
          onEdit={(user) => { onEdit(user); setCurrentUser(user);}}
          onDelete={(id) => onDelete(id)}
          onUpdateStatus={(id, newStatus) => onUpdateStatus(id, newStatus)}
          keyField="Id"
        />
      )}
      renderForm={(onSave) => (
        <CreateUser
          user={currentUser}
          setUser={setCurrentUser}
          onSave={(currentUser) => {
            if ("Id" in currentUser) {
              handleEditUser(onSave);
            } else {
              handleCreateUser(onSave);
            }
          }}
        />
      )}
      renderFilterForm={(filtros, setFiltros, fetchUsers, toggleDrawer, isDrawerOpen) => (
        <GenericFilterForm
          filters={filtros}
          setFilters={setFiltros}
          onSearch={fetchUsers}
          isDrawerOpen={isDrawerOpen}
          toggleDrawer={toggleDrawer}
          fields={[
            { type: "text", name: "Id", label: "Id", value: filtros.Id },
            { type: "text", name: "Nombres", label: "Nombres", value: filtros.Nombres },
            { type: "text", name: "Apellidos", label: "Apellidos", value: filtros.Apellidos },
            { type: "autocomplete", name: "Estatus", label: "Estatus", value: filtros.Estatus, options: [
              { id: true, label: "Activo" },
              { id: false, label: "Desactivado" },
            ] },
          ]}
        />
      )}
    />
  );
};

export default ViewUsers;
