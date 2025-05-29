-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS medical_app_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Use the created database
USE medical_app_db;

-- Create the patients table if it doesn't exist
CREATE TABLE IF NOT EXISTS patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_naissance DATE NULL,
    adresse TEXT NULL,
    telephone VARCHAR(30) NULL,
    email VARCHAR(255) NULL UNIQUE,
    historique_medical TEXT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Add some initial sample data (uncomment to use)
/*
INSERT INTO patients (nom, prenom, date_naissance, adresse, telephone, email, historique_medical) VALUES
('Dupont', 'Jean', '1985-04-12', '123 Rue de la Paix, Paris', '0123456789', 'jean.dupont@email.com', 'Allergie au pollen.'),
('Martin', 'Sophie', '1990-07-23', '45 Avenue des Champs, Lyon', '0987654321', 'sophie.martin@email.com', 'Asthme léger.'),
('Bernard', 'Pierre', '1978-11-02', '78 Boulevard Voltaire, Marseille', '0611223344', 'pierre.bernard@email.com', NULL);
*/
