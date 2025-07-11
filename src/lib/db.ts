import { Database } from 'sqlite3';
import { FormDataInterface } from '@/types/form';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

interface DatabaseAdapter {
    connect(): Promise<void>;
    query(sql: string, params?: any[]): Promise<any>;
    close(): Promise<void>;
}

class SQLiteAdapter implements DatabaseAdapter {
    private db: Database;

    constructor() {
        this.db = new Database('records.db');
    }

    async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                // Create records table with updated schema
                this.db.run(`
          CREATE TABLE IF NOT EXISTS records (
            id TEXT PRIMARY KEY,
            chalaniNumber TEXT,
            date TEXT,
            dartaNumber TEXT,
            dartaMiti TEXT,
            officeName TEXT,
            fiscalYear TEXT,
            asul REAL,
            aniyamit REAL,
            paperProof REAL,
            peski REAL,
            total REAL,
            chalaniNumber2 TEXT,
            chalaniDate TEXT,
            ministry TEXT,
            barsikPratibedan TEXT,
            samparisayad_anurodh_rakam REAL,
            lagat_katta_ko_bibarad TEXT,
            samparisad_huna_nasakeko TEXT
          )
        `, (err) => {
                    if (err) return reject(err);
                });

                // Create users table
                this.db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            password TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        });
    }

    async query(sql: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            if (sql.trim().toLowerCase().startsWith('select')) {
                this.db.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                });
            } else {
                this.db.run(sql, params, function (err) {
                    if (err) reject(err);
                    resolve({ insertId: this.lastID, changes: this.changes });
                });
            }
        });
    }

    async close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
}

class MySQLAdapter implements DatabaseAdapter {
    private connection: mysql.Connection | null = null;
    private config = {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'records_db',
    };

    async connect(): Promise<void> {
        this.connection = await mysql.createConnection(this.config);
        await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS records (
        id VARCHAR(255) PRIMARY KEY,
        chalaniNumber VARCHAR(255),
        date VARCHAR(255),
        dartaNumber VARCHAR(255),
        dartaMiti VARCHAR(255),
        officeName VARCHAR(255),
        fiscalYear VARCHAR(255),
        asul DECIMAL(10,2),
        aniyamit DECIMAL(10,2),
        paperProof DECIMAL(10,2),
        peski DECIMAL(10,2),
        total DECIMAL(10,2),
        chalaniNumber2 VARCHAR(255),
        chalaniDate VARCHAR(255),
        ministry VARCHAR(255),
        barsikPratibedan VARCHAR(255),
        samparisayad_anurodh_rakam DECIMAL(10,2),
        lagat_katta_ko_bibarad TEXT,
        samparisad_huna_nasakeko TEXT
      )
    `);
        await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }

    async query(sql: string, params: any[] = []): Promise<any> {
        if (!this.connection) throw new Error('Database not connected');
        const [results] = await this.connection.execute(sql, params);
        return results;
    }

    async close(): Promise<void> {
        if (this.connection) {
            await this.connection.end();
        }
    }
}

export class DatabaseService {
    private adapter: DatabaseAdapter;
    private static instance: DatabaseService;

    private constructor(dbType: 'sqlite' | 'mysql' = 'sqlite') {
        this.adapter = dbType === 'sqlite' ? new SQLiteAdapter() : new MySQLAdapter();
    }

    static getInstance(dbType: 'sqlite' | 'mysql' = 'sqlite'): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService(dbType);
        }
        return DatabaseService.instance;
    }

    async connect(): Promise<void> {
        await this.adapter.connect();
    }

    async saveRecord(record: FormDataInterface): Promise<void> {
        const sql = `
      INSERT INTO records (
        id, chalaniNumber, date, dartaNumber, dartaMiti, officeName,
        fiscalYear, asul, aniyamit, paperProof, peski, total,
        chalaniNumber2, chalaniDate, ministry, barsikPratibedan,
        samparisayad_anurodh_rakam, lagat_katta_ko_bibarad, samparisad_huna_nasakeko
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const params = [
            record.id,
            record.chalaniNumber,
            record.date,
            record.dartaNumber,
            record.dartaMiti,
            record.officeName,
            record.fiscalYear,
            record.asul,
            record.aniyamit,
            record.paperProof,
            record.peski,
            record.total,
            record.chalaniNumber2,
            record.chalaniDate,
            record.ministry,
            record.barsikPratibedan,
            record.samparisayad_anurodh_rakam,
            record.lagat_katta_ko_bibarad,
            record.samparisad_huna_nasakeko,
        ];
        await this.adapter.query(sql, params);
    }

    async getRecords(): Promise<FormDataInterface[]> {
        const sql = 'SELECT * FROM records';
        return await this.adapter.query(sql);
    }

    async deleteRecord(id: string): Promise<void> {
        const sql = 'DELETE FROM records WHERE id = ?';
        await this.adapter.query(sql, [id]);
    }

    async saveUser(email: string, password: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (id, email, password) VALUES (?, ?, ?)';
        const params = [Date.now().toString(), email, hashedPassword];
        await this.adapter.query(sql, params);
    }

    async getUserByEmail(email: string): Promise<any> {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const users = await this.adapter.query(sql, [email]);
        return users[0];
    }

    async close(): Promise<void> {
        await this.adapter.close();
    }
}