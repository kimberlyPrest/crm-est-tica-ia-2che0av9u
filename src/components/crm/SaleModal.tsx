import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppButton } from '@/components/AppButton'
import { Check, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { CRMLead } from '@/hooks/use-crm-data'
import { addDays } from 'date-fns'

interface Product {
  id: string
  name: string
  default_price: number
  total_sessions: number
  return_interval_days: number
}

interface SaleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: CRMLead | null
  statusId: string
  onSuccess: () => void
}

export function SaleModal({
  open,
  onOpenChange,
  lead,
  statusId,
  onSuccess,
}: SaleModalProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [totalValue, setTotalValue] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [purchaseDate, setPurchaseDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchProducts()
    }
  }, [open])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
    if (data) setProducts(data)
    if (error) toast.error('Erro ao carregar produtos')
  }

  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId)
    const product = products.find((p) => p.id === productId)
    if (product) {
      setTotalValue(product.default_price)
    }
  }

  const handleSubmit = async () => {
    if (!lead || !selectedProduct || !paymentMethod || !purchaseDate) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    try {
      const product = products.find((p) => p.id === selectedProduct)
      if (!product) throw new Error('Produto não encontrado')

      const finalValue = totalValue - discount
      const nextSessionDue = addDays(
        new Date(purchaseDate),
        product.return_interval_days,
      ).toISOString()

      // 1. Update Lead Status
      const { error: leadError } = await supabase
        .from('leads')
        .update({
          status_id: statusId,
        })
        .eq('id', lead.id)

      if (leadError) throw leadError

      // 2. Insert Deal
      const { error: dealError } = await supabase.from('deals').insert({
        lead_id: lead.id,
        product_id: selectedProduct,
        total_value: totalValue,
        discount_value: discount,
        total_sessions: product.total_sessions,
        completed_sessions: 0,
        purchase_date: purchaseDate,
        payment_method: paymentMethod,
        status: 'active',
        next_session_due: nextSessionDue,
      })

      if (dealError) throw dealError

      // 3. Insert Activity
      const { error: activityError } = await supabase
        .from('activities')
        .insert({
          lead_id: lead.id,
          type: 'deal_closed',
          description: `Venda Registrada: ${product.name}`,
          metadata: { value: finalValue },
        })

      if (activityError) throw activityError

      toast.success('Venda registrada com sucesso!')
      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error('Error registering sale:', error)
      toast.error('Erro ao registrar venda')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedProduct('')
    setTotalValue(0)
    setDiscount(0)
    setPaymentMethod('')
    setPurchaseDate(new Date().toISOString().split('T')[0])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-white/40 sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-lime-100 flex items-center justify-center text-lime-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Registrar Venda
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Produto *</Label>
            <Select value={selectedProduct} onValueChange={handleProductChange}>
              <SelectTrigger className="bg-white/50">
                <SelectValue placeholder="Selecione o produto..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} - R$ {p.default_price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Valor Total (R$)</Label>
              <Input
                type="number"
                value={totalValue}
                onChange={(e) => setTotalValue(Number(e.target.value))}
                className="bg-white/50"
              />
            </div>
            <div className="grid gap-2">
              <Label>Desconto (R$)</Label>
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="bg-white/50"
              />
            </div>
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
            <span className="font-medium text-gray-600">Valor Final:</span>
            <span className="text-lg font-bold text-brand-lime">
              R$ {(totalValue - discount).toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Pagamento *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-white/50">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Data da Compra *</Label>
              <Input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="bg-white/50"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <AppButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </AppButton>
          <AppButton
            variant="pill"
            onClick={handleSubmit}
            loading={loading}
            className="bg-brand-lime text-brand-slate"
          >
            <Check className="mr-2 h-4 w-4" /> Registrar Venda
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
