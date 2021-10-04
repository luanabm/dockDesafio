--criando tabela de pessoas
CREATE TABLE peoples(
	idPeople INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
	name varchar(100),
   cpf varchar(20),
	birthDate DATE 
);


--criando tabela de contas
CREATE TABLE accounts(
   idAccount INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
   idPeople INT,
   balance DOUBLE DEFAULT 0.0,
   limitGrabDaily DOUBLE DEFAULT 1000.0,
   flagActive BOOLEAN DEFAULT FALSE,
   accountTipe INT DEFAULT 1,
   dateCreate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY(idPeople) REFERENCES peoples(idPeople)
);

--criando tabela de transações
CREATE TABLE operations(
   idOperations INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,
   idAccount INT,
   value DOUBLE,
   dateOperations TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY(idAccount) REFERENCES accounts(idAccount)
);