-- Make sure to use the correct database
USE medical_app_db;

-- Create the appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL, -- FK to doctors.id (doctors table to be created later)
    date_heure_rdv DATETIME NOT NULL,
    motif_rdv TEXT NULLABLE,
    statut_rdv ENUM('planifié', 'terminé', 'annulé') DEFAULT 'planifié' NOT NULL,
    notes_rdv TEXT NULLABLE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    -- CONSTRAINT fk_doctor_appointment FOREIGN KEY (doctor_id) REFERENCES doctors(id) -- Add when doctors table exists
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create the prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL, -- FK to doctors.id (doctors table to be created later)
    date_prescription DATE NOT NULL,
    medicaments JSON NULLABLE, -- Example: [{"nom": "Amoxicilline 250mg", "posologie": "1 comprimé 3 fois par jour pendant 7 jours"}]
    instructions_generales TEXT NULLABLE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    -- CONSTRAINT fk_doctor_prescription FOREIGN KEY (doctor_id) REFERENCES doctors(id) -- Add when doctors table exists
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reminder for future:
-- After creating the 'doctors' table, you will need to add the foreign key constraints for 'doctor_id'.
-- Example ALTER TABLE statements:
-- ALTER TABLE appointments ADD CONSTRAINT fk_doctor_appointment FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL; -- Or ON DELETE CASCADE depending on desired behavior
-- ALTER TABLE prescriptions ADD CONSTRAINT fk_doctor_prescription FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL; -- Or ON DELETE CASCADE
