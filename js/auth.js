(() => {

    const isLogin = /\/admin\/login\.html$/.test(location.pathname);

    const isAdminPage = /\/admin\/(index|telefonos|inventario|garantias|reportes)\.html$/.test(location.pathname);

    const verificarSesion = async () => {

        try {

            const respuesta = await fetch("../backend/verificarsesion.php");
            const datos = await respuesta.json();

            return datos.autenticado === true;

        } catch (error) {

            console.error("Error al verificar sesión:", error);
            return false;

        }
    };

    // Proteger las páginas administrativas
    if (isAdminPage) {

        verificarSesion().then(autenticado => {

            if (!autenticado) {
                location.replace("login.html");
            }

        });

    }

    // Si ya inició sesión, no mostrar el login
    if (isLogin) {

        verificarSesion().then(autenticado => {

            if (autenticado) {
                location.replace("index.html");
            }

        });

        const form = document.getElementById("gcLoginForm");
        const user = document.getElementById("loginUser");
        const pass = document.getElementById("loginPassword");
        const error = document.getElementById("loginError");
        const toggle = document.getElementById("togglePassword");

        // Mostrar u ocultar contraseña
        toggle?.addEventListener("click", () => {

            const visible = pass.type === "password";

            pass.type = visible ? "text" : "password";

            toggle.setAttribute(
                "aria-label",
                visible ? "Ocultar contraseña" : "Mostrar contraseña"
            );

        });

        // Procesar inicio de sesión
        form?.addEventListener("submit", async event => {

            event.preventDefault();

            error.textContent = "";

            try {

                const respuesta = await fetch("../backend/login.php", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        usuario: user.value.trim(),
                        contrasena: pass.value

                    })

                });

                const datos = await respuesta.json();

                if (respuesta.ok && datos.success) {

                    location.href = "index.html";

                } else {

                    error.textContent = datos.message || "Datos incorrectos.";

                    pass.value = "";
                    pass.focus();

                }

            } catch (errorConexion) {

                error.textContent = "No se pudo conectar con el servidor.";

                console.error(errorConexion);

            }

        });

    }

    // Cerrar sesión
    document.addEventListener("click", async event => {

        const logout = event.target.closest("[data-gc-logout]");

        if (!logout) return;

        event.preventDefault();

        try {

            await fetch("../backend/logout.php", {
                method: "POST"
            });

        } catch (error) {

            console.error("Error al cerrar sesión:", error);

        }

        location.href = "login.html";

    });

})();