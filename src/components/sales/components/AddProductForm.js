import React, { useState } from 'react';
import {
    Box, TextField, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

const AddProductForm = ({ products, onAddProduct }) => {
    const [newProduct, setNewProduct] = useState({ productId: '', unitPrice: '', quantity: '' });

    // Handler para atualizar o preço unitário automaticamente ao selecionar um produto
    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        const selectedProduct = products.find(p => p.id === selectedProductId);
        const unitPrice = selectedProduct ? selectedProduct.price.toString() : '';
        setNewProduct({ ...newProduct, productId: selectedProductId, unitPrice });
    };

    // Handler para adicionar produto à venda
    const handleAddProduct = () => {
        if (!newProduct.productId || !newProduct.unitPrice || !newProduct.quantity) {
            alert('Preencha todos os campos do produto antes de adicionar.');
            return;
        }
        onAddProduct(newProduct);
        setNewProduct({ productId: '', unitPrice: '', quantity: '' }); // Reseta o formulário
    };

    return (
        <Box sx={{ mb: 2 }}>
            <FormControl fullWidth sx={{ mb: 1 }}>
                <InputLabel>Produto</InputLabel>
                <Select
                    value={newProduct.productId}
                    onChange={handleProductChange}
                    label="Produto"
                >
                    {products.map((p) => (
                        <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Preço Unitário"
                variant="outlined"
                fullWidth
                type="number"
                value={newProduct.unitPrice}
                onChange={(e) => setNewProduct({ ...newProduct, unitPrice: e.target.value })}
                sx={{ mb: 1 }}
            />
            <TextField
                label="Quantidade"
                variant="outlined"
                fullWidth
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            />
            <Button variant="outlined" onClick={handleAddProduct} sx={{ mt: 1 }}>
                Adicionar
            </Button>
        </Box>
    );
};

export default AddProductForm;