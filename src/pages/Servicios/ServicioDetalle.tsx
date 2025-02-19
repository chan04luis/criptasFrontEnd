import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EntServicios } from "../../entities/catalogos/servicios/EntServicios";
import CriptasService from "../../services/Catalogos/CriptasService";
import DOMPurify from "dompurify";

const ServicioDetalle = () => {
    const { id } = useParams();
    const [servicio, setServicio] = useState<EntServicios | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServicio = async () => {
            try {
                if (id) {
                    const response = await CriptasService.getByIdMovil(id);
                    if (!response.HasError && response.Result != null) {
                        setServicio(response.Result);
                    }
                }
            } catch (error) {
                console.error("Error al obtener el servicio:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            const appLink = `criptasapp://servicio/${id}`;

            const openApp = () => {
                window.location.href = appLink;

                setTimeout(() => {
                    fetchServicio();
                }, 2000);
            };

            openApp();
        }


    }, [id]);

    if (loading) return <p>Cargando...</p>;
    if (!servicio) return <p>No se encontró el servicio.</p>;

    return (
        <div style={styles.container}>
            <div style={{ ...styles.imageContainer, backgroundImage: `url(${servicio.Img})` }}>
            </div>
            <div style={styles.card}>
                <h2 style={styles.title}>{servicio.Nombre}</h2>
                <p style={styles.description} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(servicio.Descripcion || "Sin descripción") }} />
            </div>
        </div>
    );
};

export default ServicioDetalle;

// 🔹 Estilos en JS (optimizados)
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "20px",
    },
    imageContainer: {
        width: "100%",
        height: "300px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: "20px",
    },
    card: {
        backgroundColor: "white",
        padding: "20px",
        width: "90%",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        marginTop: "-30px",
        zIndex: 2,
    },
    title: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#333",
    },
    description: {
        fontSize: "16px",
        color: "#555",
        lineHeight: "1.5",
    },
    fab: {
        position: "absolute",
        bottom: "20px", // 🔹 Ajuste para que no se escondan
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        border: "none",
        color: "white",
        fontSize: "20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
        zIndex: 3, // 🔹 Asegura que los botones estén por encima de todo
    },
};
