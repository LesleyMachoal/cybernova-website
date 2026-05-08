import { ServiceModel } from '../models/serviceModel.js';

export const getServices = async (req, res) => {
  try {
    const services = await ServiceModel.getServices();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch services', error: err.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, icon, price } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const service = await ServiceModel.createService({
      name,
      description,
      icon: icon || '',
      price: price || '',
    });

    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create service', error: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, price } = req.body;

    const service = await ServiceModel.updateService(id, {
      name,
      description,
      icon,
      price,
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update service', error: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await ServiceModel.deleteService(id);
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete service', error: err.message });
  }
};
