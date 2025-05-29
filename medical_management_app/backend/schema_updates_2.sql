-- Ensure the correct database is used
USE medical_app_db;

-- Create the doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    specialisation VARCHAR(255) NULLABLE,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(30) NULLABLE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create the doctor_schedules table
CREATE TABLE IF NOT EXISTS doctor_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    jour_semaine ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche') NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    notes TEXT NULLABLE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    UNIQUE KEY uk_doctor_schedule (doctor_id, jour_semaine, heure_debut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key constraint to appointments table for doctor_id
-- First, check if the constraint already exists to avoid errors on re-running the script
SET @constraint_name = 'fk_appointment_doctor';
SET @sql_check_constraint = CONCAT(
    'SELECT COUNT(*) INTO @constraint_exists FROM information_schema.table_constraints ',
    'WHERE constraint_schema = DATABASE() AND table_name = \'appointments\' AND constraint_name = \'', @constraint_name, '\';'
);
PREPARE stmt_check FROM @sql_check_constraint;
EXECUTE stmt_check;
DEALLOCATE PREPARE stmt_check;

SET @sql_add_constraint_appointments = CONCAT(
    'ALTER TABLE appointments ADD CONSTRAINT ', @constraint_name,
    ' FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT;'
);
IF @constraint_exists = 0 THEN
    PREPARE stmt_add FROM @sql_add_constraint_appointments;
    EXECUTE stmt_add;
    DEALLOCATE PREPARE stmt_add;
    SELECT 'Constraint fk_appointment_doctor added.' AS status;
ELSE
    SELECT 'Constraint fk_appointment_doctor already exists.' AS status;
END IF;


-- Add foreign key constraint to prescriptions table for doctor_id
SET @constraint_name_prescriptions = 'fk_prescription_doctor';
SET @sql_check_constraint_prescriptions = CONCAT(
    'SELECT COUNT(*) INTO @constraint_exists_prescriptions FROM information_schema.table_constraints ',
    'WHERE constraint_schema = DATABASE() AND table_name = \'prescriptions\' AND constraint_name = \'', @constraint_name_prescriptions, '\';'
);
PREPARE stmt_check_prescriptions FROM @sql_check_constraint_prescriptions;
EXECUTE stmt_check_prescriptions;
DEALLOCATE PREPARE stmt_check_prescriptions;

SET @sql_add_constraint_prescriptions = CONCAT(
    'ALTER TABLE prescriptions ADD CONSTRAINT ', @constraint_name_prescriptions,
    ' FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT;'
);
IF @constraint_exists_prescriptions = 0 THEN
    PREPARE stmt_add_prescriptions FROM @sql_add_constraint_prescriptions;
    EXECUTE stmt_add_prescriptions;
    DEALLOCATE PREPARE stmt_add_prescriptions;
    SELECT 'Constraint fk_prescription_doctor added.' AS status;
ELSE
    SELECT 'Constraint fk_prescription_doctor already exists.' AS status;
END IF;

-- Remove the temporary variables
-- Note: User variables are session-specific and will be removed when the session ends.
-- No explicit DROP needed for @constraint_exists, @sql_check_constraint etc. in most SQL environments for session variables.
