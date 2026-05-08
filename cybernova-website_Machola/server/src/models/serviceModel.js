import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../../data');
const servicesFile = path.join(dataDir, 'services.json');

const ensureDataDir = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

const readServices = () => {
  ensureDataDir();
  if (!fs.existsSync(servicesFile)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(servicesFile, 'utf-8')) || [];
  } catch {
    return [];
  }
};

const writeServices = (services) => {
  ensureDataDir();
  fs.writeFileSync(servicesFile, JSON.stringify(services, null, 2));
};

export const ServiceModel = {
  getServices: async () => readServices(),

  createService: async (serviceData) => {
    const services = readServices();
    const newService = {
      id: Date.now().toString(),
      ...serviceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    services.unshift(newService);
    writeServices(services);
    return newService;
  },

  updateService: async (id, serviceData) => {
    const services = readServices();
    const index = services.findIndex((s) => String(s.id) === String(id));
    if (index === -1) return null;
    
    services[index] = {
      ...services[index],
      ...serviceData,
      id: services[index].id,
      created_at: services[index].created_at,
      updated_at: new Date().toISOString(),
    };
    writeServices(services);
    return services[index];
  },

  deleteService: async (id) => {
    const services = readServices();
    const filtered = services.filter((s) => String(s.id) !== String(id));
    writeServices(filtered);
    return true;
  },
};
