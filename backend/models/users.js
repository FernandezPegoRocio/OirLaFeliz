// models/users.js
async function createUserTable(db) {
    const query = `
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            age INT NOT NULL CHECK (age >= 0),
            email VARCHAR(80) NOT NULL UNIQUE,
            password VARCHAR(200) NOT NULL,
            rol VARCHAR(10) NOT NULL DEFAULT 'ARTIST',
            active BOOLEAN DEFAULT TRUE
        ) `;
    await db.query(query);
}

// Validar rol
function validateRol(rol) {
    const validRoles = ['ADMIN', 'ARTIST'];
    return validRoles.includes(rol) ? rol : 'ARTIST'; // Por defecto, ARTIST
}

// Crear usuario nuevo
async function createUser(db, usuario) {
    const query = `
        INSERT INTO Users (name, age, email, password, rol)
        VALUES (?, ?, ?, ?, ?)
    `;
    const validatedRol = validateRol(usuario.rol);
    const [result] = await db.query(query, [
        usuario.name,
        usuario.age,
        usuario.email,
        usuario.password,
        validatedRol
    ]);
    return result.insertId;
}

// Actualiza el dato de los usuarios según su id
async function updateUser(db, id, datos) {
    const query = `
        UPDATE Users
        SET name = ?, age = ?, email = ?, password = ?, rol = ?
        WHERE id = ?
    `;
    const validatedRol = validateRol(datos.rol);
    const [result] = await db.query(query, [
        datos.name,
        datos.age,
        datos.email,
        datos.password,
        validatedRol,
        id
    ]);
    return result.affectedRows;
}

// Resto de las funciones (getAllUsers, deactivateUser, deleteUser) no cambian
module.exports = {
    createUserTable,
    getAllUsers,
    createUser,
    updateUser,
    deactivateUser,
    deleteUser
};