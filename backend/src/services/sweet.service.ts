import { Sweet, ISweet } from '../models/sweet.model';
import { orderService } from './order.service';

export interface CreateSweetDTO {
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
}

export interface UpdateSweetDTO {
    name?: string;
    category?: string;
    price?: number;
    quantity?: number;
    description?: string;
}

export interface SearchQuery {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
}

export class SweetService {
    public async createSweet(data: CreateSweetDTO): Promise<ISweet> {
        try {
            const sweet = await Sweet.create(data);
            return sweet;
        } catch (error: any) {
            throw new Error(`Failed to create sweet: ${error.message}`);
        }
    }

    public async getAllSweets(): Promise<ISweet[]> {
        try {
            const sweets = await Sweet.find().sort({ createdAt: -1 });
            return sweets;
        } catch (error: any) {
            throw new Error(`Failed to retrieve sweets: ${error.message}`);
        }
    }

    public async getSweetById(id: string): Promise<ISweet> {
        try {
            const sweet = await Sweet.findById(id);
            if (!sweet) {
                throw new Error('Sweet not found');
            }
            return sweet;
        } catch (error: any) {
            throw new Error(`Failed to retrieve sweet: ${error.message}`);
        }
    }

    public async searchSweets(query: SearchQuery): Promise<ISweet[]> {
        try {
            const filter: any = {};

            if (query.name) {
                filter.name = { $regex: query.name, $options: 'i' };
            }

            if (query.category) {
                filter.category = query.category;
            }

            if (query.minPrice !== undefined || query.maxPrice !== undefined) {
                filter.price = {};
                if (query.minPrice !== undefined) {
                    filter.price.$gte = query.minPrice;
                }
                if (query.maxPrice !== undefined) {
                    filter.price.$lte = query.maxPrice;
                }
            }

            const sweets = await Sweet.find(filter).sort({ createdAt: -1 });
            return sweets;
        } catch (error: any) {
            throw new Error(`Failed to search sweets: ${error.message}`);
        }
    }

    public async updateSweet(id: string, data: UpdateSweetDTO): Promise<ISweet> {
        try {
            const sweet = await Sweet.findByIdAndUpdate(
                id,
                { $set: data },
                { new: true, runValidators: true }
            );

            if (!sweet) {
                throw new Error('Sweet not found');
            }

            return sweet;
        } catch (error: any) {
            throw new Error(`Failed to update sweet: ${error.message}`);
        }
    }

    public async deleteSweet(id: string): Promise<void> {
        try {
            const sweet = await Sweet.findByIdAndDelete(id);
            if (!sweet) {
                throw new Error('Sweet not found');
            }
        } catch (error: any) {
            throw new Error(`Failed to delete sweet: ${error.message}`);
        }
    }

    public async purchaseSweet(id: string, userId: string, quantity: number): Promise<ISweet> {
        try {
            if (!Number.isInteger(quantity) || quantity <= 0) {
                throw new Error('Quantity must be a positive integer');
            }

            const sweet = await Sweet.findById(id);
            if (!sweet) {
                throw new Error('Sweet not found');
            }

            if (sweet.quantity < quantity) {
                throw new Error(`Insufficient quantity. Only ${sweet.quantity} available`);
            }

            sweet.quantity -= quantity;
            await sweet.save();

            try {
                await orderService.createOrder(userId, [{
                    sweetId: sweet._id as any,
                    name: sweet.name,
                    quantity: quantity,
                    price: sweet.price
                }]);
            } catch (orderError) {
                console.error('Failed to create order record:', orderError);
            }

            return sweet;
        } catch (error: any) {
            throw new Error(`Failed to purchase sweet: ${error.message}`);
        }
    }

    public async restockSweet(id: string, quantity: number): Promise<ISweet> {
        try {
            if (!Number.isInteger(quantity) || quantity <= 0) {
                throw new Error('Quantity must be a positive integer');
            }

            const sweet = await Sweet.findById(id);
            if (!sweet) {
                throw new Error('Sweet not found');
            }

            sweet.quantity += quantity;
            await sweet.save();

            return sweet;
        } catch (error: any) {
            throw new Error(`Failed to restock sweet: ${error.message}`);
        }
    }
}
