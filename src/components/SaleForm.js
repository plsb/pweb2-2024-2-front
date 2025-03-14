import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Box, IconButton, Modal, Typography, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const SaleForm = ({ open, onClose, onSave, initialData, products }) => {
  const isEdit = !!initialData;
  const [saleData, setSaleData] = useState(
    initialData || { saleDate: '', discount: '0.00', products: [] }
  );
  const [newProduct, setNewProduct] = useState({ productId: '', unitPrice: '', quantity: '' });

  // Função para adicionar produto à tabela
  const addProductToSale = () => {
    if (!newProduct.productId || !newProduct.unitPrice || !newProduct.quantity) {
      alert('Preencha todos os campos do produto antes de adicionar.');
      return;
    }
    setSaleData({
      ...saleData,
      products: [...saleData.products, { ...newProduct }]
    });
    setNewProduct({ productId: '', unitPrice: '', quantity: '' });
  };

  // Função para remover produto da tabela
  const removeProductFromSale = (index) => {
    const updatedProducts = saleData.products.filter((_, i) => i !== index);
    setSaleData({ ...saleData, products: updatedProducts });
  };

  // Calcular total dos produtos (sem desconto)
  const calculateTotal = () => {
    return saleData.products.reduce((total, p) => {
      return total + (parseFloat(p.unitPrice || 0) * parseInt(p.quantity || 0, 10));
    }, 0);
  };

  // Calcular total com desconto
  const calculateTotalWithDiscount = () => {
    const total = calculateTotal();
    const discount = parseFloat(saleData.discount || 0);
    return (total - discount).toFixed(2);
  };

  // Função para salvar (criar ou atualizar)
  const handleSave = () => {
    const formattedData = {
      saleDate: saleData.saleDate || new Date().toISOString().split('T')[0],
      discount: parseFloat(saleData.discount),
      products: saleData.products.map(p => ({
        productId: p.productId,
        unitPrice: parseFloat(p.unitPrice),
        quantity: parseInt(p.quantity, 10)
      }))
    };
    onSave(formattedData);
  };

  // Handler para atualizar o preço unitário automaticamente ao selecionar um produto
  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(p => p.id === selectedProductId);
    const unitPrice = selectedProduct ? selectedProduct.price.toString() : '';
    setNewProduct({ ...newProduct, productId: selectedProductId, unitPrice });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <Typography variant="h6" mb={2}>
          {isEdit ? 'Editar Venda' : 'Criar Nova Venda'}
        </Typography>
        <TextField
          label="Data da Venda"
          type="date"
          variant="outlined"
          fullWidth
          value={saleData.saleDate}
          onChange={(e) => setSaleData({ ...saleData, saleDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Desconto"
          variant="outlined"
          fullWidth
          type="number"
          value={saleData.discount}
          onChange={(e) => setSaleData({ ...saleData, discount: e.target.value })}
          sx={{ mb: 2 }}
        />

        {/* Formulário para adicionar produto */}
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
          <Button variant="outlined" onClick={addProductToSale} sx={{ mt: 1 }}>
            Adicionar
          </Button>
        </Box>

        {/* Tabela de produtos adicionados */}
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell>Preço Unitário</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {saleData.products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{products.find(p => p.id === product.productId)?.name || 'N/A'}</TableCell>
                  <TableCell>{parseFloat(product.unitPrice).toFixed(2)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{(parseFloat(product.unitPrice) * parseInt(product.quantity, 10)).toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => removeProductFromSale(index)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Exibição do Valor Total e Total com Desconto */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            Valor Total: {calculateTotal().toFixed(2)}
          </Typography>
          <Typography variant="body1">
            Total com Desconto: {calculateTotalWithDiscount()}
          </Typography>
        </Box>

        <Button variant="contained" onClick={handleSave}>
          {isEdit ? 'Atualizar' : 'Salvar'}
        </Button>
      </Box>
    </Modal>
  );
};

export default SaleForm;