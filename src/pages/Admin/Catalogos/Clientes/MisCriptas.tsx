import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    AppBar,
    Toolbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    TableFooter,
    TablePagination,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ClienteService from "../../../../services/Catalogos/ClienteService";
import { toast } from "react-toastify";
import { Skull } from "lucide-react"; // Ícono de cripta
import { Configuracion } from "../../../../entities/Seguridad/Configuracion";
import { MisCriptas } from "../../../../entities/Administracion/Clientes/MisCriptas";
import IndexFallecidos from "../Fallecidos/IndexFallecidos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupsIcon from "@mui/icons-material/Groups";
import { useNavigate } from "react-router-dom";
import CustomIconButton from "../../../Utils/CustomIconButton";
import IndexBeneficiarios from "../Beneficiarios/IndexBeneficiarios";
import RefreshIcon from "@mui/icons-material/Refresh";

interface MisCriptasProps {
    parentConfig: Configuracion | undefined;
}

const MisCriptasPage: React.FC<MisCriptasProps> = ({ parentConfig }) => {
    const { uIdCliente } = useParams<{ uIdCliente: string }>(); // Obtiene el ID del cliente de la URL
    const [criptas, setCriptas] = useState<MisCriptas[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalReg, setTotalReg] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const navigate = useNavigate();

    const [openFallecidosModal, setOpenFallecidosModal] = useState<boolean>(false);
    const [openBeneficiariosModal, setOpenBeneficiariosModal] = useState<boolean>(false);
    const [selectedCriptaId, setSelectedCriptaId] = useState<string | null>(null);

    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (uIdCliente) fetchCriptas();
    }, [uIdCliente]);

    const fetchCriptas = async () => {
        if (!uIdCliente) return;
        setLoading(true);
        try {
            const response = await ClienteService.getMyCriptas(uIdCliente);
            if (!response.HasError) {
                setCriptas(response.Result);
                setTotalReg(response.Result.length);
            } else {
                toast.warn(response.Message);
            }
        } catch (error) {
            toast.error("Error al obtener las criptas.");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenFallecidosModal = (uIdCripta: string) => {
        setSelectedCriptaId(uIdCripta);
        setOpenFallecidosModal(true);
    };

    const handleOpenBeneficiariosModal = (uIdCripta: string) => {
        setSelectedCriptaId(uIdCripta);
        setOpenBeneficiariosModal(true);
    };

    return (
        <Box sx={{ width: "100%", minHeight: "90vh", backgroundColor: "#f2f2f2" }}>
            <AppBar position="static" sx={{ backgroundColor: parentConfig?.ColorSecundario || "#000000" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: parentConfig?.ContrasteSecundario || "#ffffff" }}>
                        Mis Criptas
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <CustomIconButton onClick={handleGoBack} title="Regresar">
                            <ArrowBackIcon />
                        </CustomIconButton>
                        <CustomIconButton onClick={fetchCriptas} title="Refrescar">
                            <RefreshIcon />
                        </CustomIconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Paper elevation={3} sx={{ margin: 2, padding: 2 }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: parentConfig?.ColorPrimario || "#1976d2" }}>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Cripta</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Sección</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Zona</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Iglesia</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Fallecidos</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Beneficiarios</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Fecha Compra</TableCell>
                                    <TableCell sx={{ color: parentConfig?.ContrastePrimario || "#ffffff" }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {criptas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cripta) => (
                                    <TableRow key={cripta.Id}>
                                        <TableCell>{cripta.Cripta}</TableCell>
                                        <TableCell>{cripta.Seccion}</TableCell>
                                        <TableCell>{cripta.Zona}</TableCell>
                                        <TableCell>{cripta.Iglesia}</TableCell>
                                        <TableCell>{cripta.Fallecidos}</TableCell>
                                        <TableCell>{cripta.Beneficiarios}</TableCell>
                                        <TableCell>{new Date(cripta.FechaCompra).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <IconButton title="Ver Fallecidos" sx={{ color: "darkred" }} onClick={() => handleOpenFallecidosModal(cripta.Id)}>
                                                <Skull size={20} />
                                            </IconButton>
                                            <IconButton title="Ver Beneficiarios" sx={{ color: "darkred" }} onClick={() => handleOpenBeneficiariosModal(cripta.Id)}>
                                                <GroupsIcon fontSize="medium" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={8}>
                                        <TablePagination
                                            component="div"
                                            count={totalReg}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            rowsPerPage={rowsPerPage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            labelRowsPerPage="Registros por página:"
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <Dialog open={openFallecidosModal} onClose={() => setOpenFallecidosModal(false)} fullWidth maxWidth="lg">
                <DialogContent>
                    {selectedCriptaId && <IndexFallecidos parentConfig={parentConfig} uIdCripta={selectedCriptaId} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFallecidosModal(false)} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openBeneficiariosModal} onClose={() => setOpenBeneficiariosModal(false)} fullWidth maxWidth="lg">
                <DialogContent>
                    {selectedCriptaId && <IndexBeneficiarios parentConfig={parentConfig} uIdCripta={selectedCriptaId} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBeneficiariosModal(false)} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MisCriptasPage;
