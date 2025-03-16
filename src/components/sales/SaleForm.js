import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Box, Modal, Typography
} from '@mui/material';
import AddProductForm from './components/AddProductForm'; // Importa o componente de adição de produtos
import ProductTable from './components/ProductTable'; // Importa o novo componente de tabela

const SaleForm = ({ open, onClose, onSave, initialData, products }) => {
  const isEdit = !!initialData;
  const [saleData, setSaleData] = useState(
      initialData || { saleDate: '', discount: '0.00', products: [] }
  );

  // Atualiza o estado `saleData` quando `initialData` mudar
  useEffect(() => {
    if (isEdit && initialData) {
      setSaleData(initialData);
    } else {
      setSaleData({ saleDate: '', discount: '0.00', products: [] }); // Reseta o formulário no modo de criação
    }
  }, [initialData, isEdit]);

  // Função para adicionar produto à tabela
  const handleAddProduct = (newProduct) => {
    setSaleData({
      ...saleData,
      products: [...saleData.products, { ...newProduct }]
    });
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

          {/* Componente para adicionar produto */}
          <AddProductForm
              products={products}
              onAddProduct={handleAddProduct}
          />

          {/* Componente para exibir a tabela de produtos */}
          <ProductTable
              products={saleData.products.map(p => ({
                ...p,
                name: products.find(prod => prod.id === p.productId)?.name || 'N/A'
              }))}
              onRemoveProduct={removeProductFromSale}
          />

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