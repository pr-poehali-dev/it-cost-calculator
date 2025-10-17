import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Specialist {
  id: string;
  name: string;
  count: number;
  hours: number;
  minSalary: number;
  maxSalary: number;
  marketPrice: number;
  isRemote: boolean;
  canBeRemote: boolean;
}

interface Equipment {
  id: string;
  name: string;
  count: number;
  category: 'server' | 'network' | 'workplace';
  hoursPerMonth: number;
}

interface Service {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}

const EQUIPMENT_MAINTENANCE_HOURS: { [key: string]: number } = {
  's1': 8,
  's2': 4,
  's3': 10,
  's4': 6,
  's5': 2,
  'n1': 3,
  'n2': 4,
  'n3': 6,
  'n4': 2,
  'n5': 3,
  'w1': 1,
  'w2': 1,
  'w3': 0.5,
  'w4': 2,
  'w5': 1.5,
  'w6': 2,
  'w7': 0.5,
  'w8': 1,
};

const Index = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([
    { id: '1', name: 'Инженер технической поддержки', count: 1, hours: 160, minSalary: 80000, maxSalary: 120000, marketPrice: 107500, isRemote: false, canBeRemote: true },
    { id: '2', name: 'Системный администратор', count: 1, hours: 160, minSalary: 100000, maxSalary: 150000, marketPrice: 137556, isRemote: false, canBeRemote: true },
    { id: '3', name: 'Сетевой администратор', count: 1, hours: 160, minSalary: 120000, maxSalary: 180000, marketPrice: 160000, isRemote: false, canBeRemote: true },
    { id: '4', name: 'Начальник отдела', count: 1, hours: 160, minSalary: 150000, maxSalary: 200000, marketPrice: 0, isRemote: false, canBeRemote: false },
  ]);

  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: 's1', name: 'Сервер физический', count: 0, category: 'server', hoursPerMonth: 8 },
    { id: 's2', name: 'Сервер виртуальный', count: 0, category: 'server', hoursPerMonth: 4 },
    { id: 's3', name: 'Система хранения данных', count: 0, category: 'server', hoursPerMonth: 10 },
    { id: 's4', name: 'Система резервного копирования', count: 0, category: 'server', hoursPerMonth: 6 },
    { id: 's5', name: 'Серверный ИБП', count: 0, category: 'server', hoursPerMonth: 2 },
    { id: 'n1', name: 'Коммутатор', count: 0, category: 'network', hoursPerMonth: 3 },
    { id: 'n2', name: 'Маршрутизатор', count: 0, category: 'network', hoursPerMonth: 4 },
    { id: 'n3', name: 'Межсетевой экран', count: 0, category: 'network', hoursPerMonth: 6 },
    { id: 'n4', name: 'Точка доступа Wi-Fi', count: 0, category: 'network', hoursPerMonth: 2 },
    { id: 'n5', name: 'Прочее сетевое оборудование', count: 0, category: 'network', hoursPerMonth: 3 },
    { id: 'w1', name: 'Рабочая станция', count: 0, category: 'workplace', hoursPerMonth: 1 },
    { id: 'w2', name: 'Ноутбук', count: 0, category: 'workplace', hoursPerMonth: 1 },
    { id: 'w3', name: 'Терминальный клиент', count: 0, category: 'workplace', hoursPerMonth: 0.5 },
    { id: 'w4', name: 'МФУ', count: 0, category: 'workplace', hoursPerMonth: 2 },
    { id: 'w5', name: 'Принтер А3', count: 0, category: 'workplace', hoursPerMonth: 1.5 },
    { id: 'w6', name: 'Плоттер', count: 0, category: 'workplace', hoursPerMonth: 2 },
    { id: 'w7', name: 'ИБП для рабочих мест', count: 0, category: 'workplace', hoursPerMonth: 0.5 },
    { id: 'w8', name: 'Прочее оборудование', count: 0, category: 'workplace', hoursPerMonth: 1 },
  ]);

  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'Мониторинг ИТ-инфраструктуры', enabled: false, description: 'Автоматический мониторинг серверов, сетевого оборудования и СХД' },
    { id: '2', name: 'Управление резервным копированием', enabled: false, description: 'Настройка, мониторинг и управление системами резервного копирования' },
    { id: '3', name: 'Регулярный аудит безопасности', enabled: false, description: 'Периодическая проверка систем безопасности' },
    { id: '4', name: 'План аварийного восстановления', enabled: false, description: 'Разработка и поддержка плана' },
  ]);

  const [slaLevel, setSlaLevel] = useState<string>('basic');
  const [officeCount, setOfficeCount] = useState<number>(1);
  const [globalHours, setGlobalHours] = useState<number>(160);

  const [settings, setSettings] = useState({
    vat: 20,
    priceGrowth: 5,
    regionalCoef: 1.0,
    salaryIndexation: 7,
    margin: 15,
    complexityCoef: 1.0,
    taxLoad: 6,
    payrollTax: 30.2,
    overhead: 10,
    adminExpenses: 5,
  });

  const applyGlobalHours = () => {
    setSpecialists(specialists.map(s => ({ ...s, hours: globalHours })));
  };

  const updateSpecialist = (id: string, field: keyof Specialist, value: any) => {
    setSpecialists(specialists.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateEquipment = (id: string, count: number) => {
    setEquipment(equipment.map(e => e.id === id ? { ...e, count } : e));
  };

  const updateEquipmentHours = (id: string, hours: number) => {
    setEquipment(equipment.map(e => e.id === id ? { ...e, hoursPerMonth: hours } : e));
  };

  const toggleService = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const calculations = useMemo(() => {
    const headMarketPrice = specialists
      .filter(s => s.id !== '4')
      .reduce((sum, s) => sum + s.marketPrice, 0) / specialists.filter(s => s.id !== '4').length * 1.015;

    const specialistsWithMarket = specialists.map(s => 
      s.id === '4' ? { ...s, marketPrice: headMarketPrice } : s
    );

    const avgHourlyRatePerSpecialist = specialistsWithMarket.map(s => {
      const avgSalary = (s.minSalary + s.maxSalary) / 2;
      const hourlyRate = avgSalary / 160;
      const hourlyRateWithTaxes = hourlyRate * (1 + settings.payrollTax / 100) * settings.regionalCoef;
      
      return {
        id: s.id,
        name: s.name,
        avgSalary,
        hourlyRate: hourlyRateWithTaxes,
        marketHourlyRate: s.marketPrice / 160,
        count: s.count,
        hours: s.hours,
      };
    });

    const equipmentDetails = equipment.map(eq => {
      if (eq.count === 0) return null;

      const totalHours = eq.hoursPerMonth * eq.count;
      const avgHourlyRate = avgHourlyRatePerSpecialist.reduce((sum, s) => sum + s.hourlyRate, 0) / avgHourlyRatePerSpecialist.length;
      
      const laborCost = totalHours * avgHourlyRate * settings.complexityCoef;
      
      const withOverhead = laborCost * (1 + settings.overhead / 100);
      const withAdmin = withOverhead * (1 + settings.adminExpenses / 100);
      
      const marketAvgRate = avgHourlyRatePerSpecialist.reduce((sum, s) => sum + s.marketHourlyRate, 0) / avgHourlyRatePerSpecialist.length;
      const marketCost = totalHours * marketAvgRate * 1.3;

      return {
        id: eq.id,
        name: eq.name,
        count: eq.count,
        category: eq.category,
        hoursPerUnit: eq.hoursPerMonth,
        totalHours,
        laborCost,
        withOverhead,
        finalCost: withAdmin,
        marketCost,
        costBreakdown: {
          labor: laborCost,
          overhead: withOverhead - laborCost,
          admin: withAdmin - withOverhead,
        }
      };
    }).filter(Boolean) as any[];

    const totalEquipmentCost = equipmentDetails.reduce((sum, e) => sum + e.finalCost, 0);
    const totalMarketEquipmentCost = equipmentDetails.reduce((sum, e) => sum + e.marketCost, 0);

    const monitoredEquipmentCount = equipment
      .filter(e => (e.category === 'server' || e.category === 'network') && e.count > 0)
      .reduce((sum, e) => sum + e.count, 0);

    const serviceDetails = services.map(s => {
      if (!s.enabled) return null;
      
      let baseCost = 0;
      if (s.id === '1') baseCost = monitoredEquipmentCount * 500;
      if (s.id === '2') baseCost = 15000;
      if (s.id === '3') baseCost = 25000;
      if (s.id === '4') baseCost = 20000;

      const withOverhead = baseCost * (1 + settings.overhead / 100);
      const finalCost = withOverhead * (1 + settings.adminExpenses / 100);
      
      return {
        id: s.id,
        name: s.name,
        baseCost,
        finalCost,
        costBreakdown: {
          base: baseCost,
          overhead: withOverhead - baseCost,
          admin: finalCost - withOverhead,
        }
      };
    }).filter(Boolean) as any[];

    const totalServiceCost = serviceDetails.reduce((sum, s) => sum + s.finalCost, 0);

    const slaMultiplier = slaLevel === 'basic' ? 1 : slaLevel === 'standard' ? 1.2 : 1.5;
    const officeMultiplier = 1 + ((officeCount - 1) * 0.15);

    const subtotal = (totalEquipmentCost + totalServiceCost) * slaMultiplier * officeMultiplier;
    
    const personnelDirectCost = specialistsWithMarket.reduce((sum, s) => {
      const avgSalary = (s.minSalary + s.maxSalary) / 2;
      const totalSalary = avgSalary * s.count;
      const withTaxes = totalSalary * (1 + settings.payrollTax / 100) * settings.regionalCoef;
      return sum + withTaxes;
    }, 0);

    const totalWithPersonnel = subtotal + personnelDirectCost;
    
    const marginAmount = totalWithPersonnel * (settings.margin / 100);
    const totalCurrent = totalWithPersonnel + marginAmount;
    
    const totalNextYear = totalCurrent * (1 + ((settings.priceGrowth + settings.salaryIndexation) / 2) / 100);
    
    const marketSubtotal = (totalMarketEquipmentCost + totalServiceCost * 1.3) * slaMultiplier * officeMultiplier;
    const marketPersonnel = specialistsWithMarket.reduce((sum, s) => sum + s.marketPrice * s.count * settings.regionalCoef, 0);
    const marketTotal = (marketSubtotal + marketPersonnel) * (1 + settings.margin / 100);
    
    const marketDiff = totalCurrent - marketTotal;
    const marketDiffPercent = (marketDiff / marketTotal) * 100;

    const profitability = (marginAmount / totalCurrent) * 100;

    const personnelDetails = specialistsWithMarket.map(s => {
      const avgSalary = (s.minSalary + s.maxSalary) / 2;
      const totalSalary = avgSalary * s.count;
      const withTaxes = totalSalary * (1 + settings.payrollTax / 100) * settings.regionalCoef;
      const hourlyRate = avgSalary / 160;
      
      return {
        name: s.name,
        count: s.count,
        avgSalary,
        hourlyRate,
        totalCost: withTaxes,
        marketCost: s.marketPrice * s.count,
        costBreakdown: {
          salary: totalSalary,
          taxes: withTaxes - totalSalary,
        }
      };
    });

    return {
      equipmentDetails,
      serviceDetails,
      personnelDetails,
      totalEquipmentCost,
      totalServiceCost,
      personnelDirectCost,
      subtotal,
      marginAmount,
      totalCurrent,
      totalNextYear,
      marketTotal,
      marketDiff,
      marketDiffPercent,
      profitability,
      slaMultiplier,
      officeMultiplier,
      monitoredEquipmentCount,
      avgHourlyRatePerSpecialist,
    };
  }, [specialists, equipment, services, settings, slaLevel, officeCount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Калькулятор стоимости сопровождения ИТ-инфраструктуры
          </h1>
          <p className="text-slate-300 text-lg">
            Профессиональный расчет на основе времени обслуживания оборудования
          </p>
        </div>

        <Tabs defaultValue="personnel" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="personnel" className="data-[state=active]:bg-purple-600">
              <Icon name="Users" className="h-4 w-4 mr-2" />
              Персонал
            </TabsTrigger>
            <TabsTrigger value="equipment" className="data-[state=active]:bg-purple-600">
              <Icon name="Server" className="h-4 w-4 mr-2" />
              Оборудование
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-purple-600">
              <Icon name="Briefcase" className="h-4 w-4 mr-2" />
              Доп. услуги
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
              <Icon name="Settings" className="h-4 w-4 mr-2" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-purple-600">
              <Icon name="FileText" className="h-4 w-4 mr-2" />
              Результат
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personnel" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Clock" className="h-5 w-5 text-purple-400" />
                  Применить часы ко всем специалистам
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label className="text-slate-300">Количество часов в месяц</Label>
                  <Input
                    type="number"
                    value={globalHours}
                    onChange={(e) => setGlobalHours(parseInt(e.target.value) || 160)}
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
                </div>
                <Button onClick={applyGlobalHours} className="bg-purple-600 hover:bg-purple-700">
                  Применить ко всем
                </Button>
              </CardContent>
            </Card>

            {specialists.map((specialist, idx) => (
              <Card key={specialist.id} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Icon name="User" className="h-5 w-5 text-purple-400" />
                      {specialist.name}
                    </CardTitle>
                    {specialist.canBeRemote && (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={specialist.isRemote}
                          onCheckedChange={(checked) => updateSpecialist(specialist.id, 'isRemote', checked)}
                        />
                        <span className="text-sm text-slate-300">Удаленный</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-300">Количество сотрудников</Label>
                    <Input
                      type="number"
                      min="1"
                      value={specialist.count}
                      onChange={(e) => updateSpecialist(specialist.id, 'count', parseInt(e.target.value) || 1)}
                      className="bg-slate-800 border-slate-600 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Часов в месяц</Label>
                    <Input
                      type="number"
                      value={specialist.hours}
                      onChange={(e) => updateSpecialist(specialist.id, 'hours', parseInt(e.target.value) || 160)}
                      className="bg-slate-800 border-slate-600 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Мин. зарплата (на руки)</Label>
                    <Input
                      type="number"
                      value={specialist.minSalary}
                      onChange={(e) => updateSpecialist(specialist.id, 'minSalary', parseInt(e.target.value) || 0)}
                      className="bg-slate-800 border-slate-600 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">Макс. зарплата (на руки)</Label>
                    <Input
                      type="number"
                      value={specialist.maxSalary}
                      onChange={(e) => updateSpecialist(specialist.id, 'maxSalary', parseInt(e.target.value) || 0)}
                      className="bg-slate-800 border-slate-600 text-white mt-2"
                    />
                  </div>
                  {specialist.id !== '4' && (
                    <div>
                      <Label className="text-slate-300">Рыночная стоимость</Label>
                      <Input
                        type="number"
                        value={specialist.marketPrice}
                        onChange={(e) => updateSpecialist(specialist.id, 'marketPrice', parseInt(e.target.value) || 0)}
                        className="bg-slate-800 border-slate-600 text-white mt-2"
                      />
                    </div>
                  )}
                  {specialist.id === '4' && (
                    <div>
                      <Label className="text-slate-300">Рыночная стоимость</Label>
                      <Input
                        type="number"
                        value={Math.round(specialists.filter(s => s.id !== '4').reduce((sum, s) => sum + s.marketPrice, 0) / specialists.filter(s => s.id !== '4').length * 1.015)}
                        disabled
                        className="bg-slate-700 border-slate-600 text-slate-400 mt-2"
                      />
                      <p className="text-xs text-slate-400 mt-1">Автоматически на 1.5% выше среднего</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            <Card className="bg-blue-900/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Info" className="h-5 w-5 text-blue-400" />
                  Средняя стоимость часа работы специалистов
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {calculations.avgHourlyRatePerSpecialist.map((s, idx) => (
                  <div key={idx} className="flex justify-between p-2 bg-slate-800/50 rounded">
                    <span className="text-slate-300">{s.name}:</span>
                    <span className="text-white font-mono">{s.hourlyRate.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽/час</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Server" className="h-5 w-5 text-blue-400" />
                  Серверное оборудование
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.filter(e => e.category === 'server').map(e => (
                  <div key={e.id} className="space-y-2">
                    <Label className="text-slate-300">{e.name}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="number"
                          min="0"
                          value={e.count}
                          onChange={(ev) => updateEquipment(e.id, parseInt(ev.target.value) || 0)}
                          placeholder="Кол-во"
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          value={e.hoursPerMonth}
                          onChange={(ev) => updateEquipmentHours(e.id, parseFloat(ev.target.value) || 0)}
                          placeholder="Часов/мес"
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Network" className="h-5 w-5 text-green-400" />
                  Сетевое оборудование
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.filter(e => e.category === 'network').map(e => (
                  <div key={e.id} className="space-y-2">
                    <Label className="text-slate-300">{e.name}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="number"
                          min="0"
                          value={e.count}
                          onChange={(ev) => updateEquipment(e.id, parseInt(ev.target.value) || 0)}
                          placeholder="Кол-во"
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          value={e.hoursPerMonth}
                          onChange={(ev) => updateEquipmentHours(e.id, parseFloat(ev.target.value) || 0)}
                          placeholder="Часов/мес"
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Monitor" className="h-5 w-5 text-purple-400" />
                  Рабочие места и периферия
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.filter(e => e.category === 'workplace').map(e => (
                  <div key={e.id} className="space-y-2">
                    <Label className="text-slate-300">{e.name}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="number"
                          min="0"
                          value={e.count}
                          onChange={(ev) => updateEquipment(e.id, parseInt(ev.target.value) || 0)}
                          placeholder="Кол-во"
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          value={e.hoursPerMonth}
                          onChange={(ev) => updateEquipmentHours(e.id, parseFloat(ev.target.value) || 0)}
                          placeholder="Часов/мес"
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-blue-900/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Info" className="h-5 w-5 text-blue-400" />
                  Стоимость обслуживания оборудования (с составом цены)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {calculations.equipmentDetails.map((e, idx) => (
                  <div key={idx} className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300 font-semibold">{e.name} ({e.count} ед.)</span>
                      <span className="text-white font-mono font-bold">{e.finalCost.toLocaleString('ru-RU')} ₽/мес</span>
                    </div>
                    <div className="text-xs space-y-1 pl-4">
                      <div className="flex justify-between text-slate-400">
                        <span>Трудозатраты ({e.totalHours.toFixed(1)} ч × ср. ставка):</span>
                        <span className="font-mono">{e.costBreakdown.labor.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Накладные расходы ({settings.overhead}%):</span>
                        <span className="font-mono">{e.costBreakdown.overhead.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Административные расходы ({settings.adminExpenses}%):</span>
                        <span className="font-mono">{e.costBreakdown.admin.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="flex justify-between text-green-400 pt-1">
                        <span>Рыночная стоимость:</span>
                        <span className="font-mono">{e.marketCost.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    </div>
                  </div>
                ))}
                {calculations.equipmentDetails.length === 0 && (
                  <p className="text-slate-400 text-center py-4">Добавьте оборудование для расчета стоимости</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Briefcase" className="h-5 w-5 text-green-400" />
                  Дополнительные услуги
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {services.map(service => (
                  <div key={service.id} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg">
                    <Switch
                      checked={service.enabled}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{service.name}</h4>
                      <p className="text-slate-400 text-sm mt-1">{service.description}</p>
                      {service.enabled && service.id === '1' && (
                        <p className="text-purple-400 text-sm mt-2">
                          Оборудование для мониторинга: {calculations.monitoredEquipmentCount} ед.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Уровень обслуживания SLA</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={slaLevel} onValueChange={setSlaLevel}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Базовый (×1.0)</SelectItem>
                    <SelectItem value="standard">Стандартный (×1.2)</SelectItem>
                    <SelectItem value="premium">Премиум (×1.5)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Количество офисов</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  min="1"
                  value={officeCount}
                  onChange={(e) => setOfficeCount(parseInt(e.target.value) || 1)}
                  className="bg-slate-800 border-slate-600 text-white"
                />
                <p className="text-slate-400 text-sm mt-2">
                  Каждый дополнительный офис увеличивает стоимость на 15%
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Settings" className="h-5 w-5 text-purple-400" />
                  Параметры расчета
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-slate-300">Ставка НДС (%)</Label>
                  <Input
                    type="number"
                    value={settings.vat}
                    onChange={(e) => setSettings({ ...settings, vat: parseFloat(e.target.value) || 0 })}
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Прогноз роста цен на следующий год (%)</Label>
                  <Input
                    type="number"
                    value={settings.priceGrowth}
                    onChange={(e) => setSettings({ ...settings, priceGrowth: parseFloat(e.target.value) || 0 })}
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
                  <p className="text-slate-400 text-xs mt-1">Учитывает инфляцию и рост стоимости услуг</p>
                </div>
                <div>
                  <Label className="text-slate-300">Районный коэффициент</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.regionalCoef}
                    onChange={(e) => setSettings({ ...settings, regionalCoef: parseFloat(e.target.value) || 1 })}
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Прогноз индексации зарплат на следующий год (%)</Label>
                  <Input
                    type="number"
                    value={settings.salaryIndexation}
                    onChange={(e) => setSettings({ ...settings, salaryIndexation: parseFloat(e.target.value) || 0 })}
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
                  <p className="text-slate-400 text-xs mt-1">Учитывает планируемое повышение зарплат</p>
                </div>
                <div>
                  <Label className="text-slate-300">Маржинальность (%)</Label>
                  <Input
                    type="number"
                    value={settings.margin}
                    onChange={(e) => setSettings({ ...settings, margin: parseFloat(e.target.value) || 0 })}
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Коэффициент сложности</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.complexityCoef}
                    onChange={(e) => setSettings({ ...settings, complexityCoef: parseFloat(e.target.value) || 1 })}
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
                  <p className="text-slate-400 text-xs mt-1">Учитывает структуру организации и сложность инфраструктуры</p>
                </div>
                <div>
                  <Label className="text-slate-300">Налоговая нагрузка (%)</Label>
                  <Input
                    type="number"
                    value={settings.taxLoad}
                    onChange={(e) => setSettings({ ...settings, taxLoad: parseFloat(e.target.value) || 0 })}
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Налоги на ФОТ (%)</Label>
                  <Input
                    type="number"
                    value={settings.payrollTax}
                    onChange={(e) => setSettings({ ...settings, payrollTax: parseFloat(e.target.value) || 0 })}
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Накладные расходы (%)</Label>
                  <Input
                    type="number"
                    value={settings.overhead}
                    onChange={(e) => setSettings({ ...settings, overhead: parseFloat(e.target.value) || 0 })}
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Административные и прочие расходы (%)</Label>
                  <Input
                    type="number"
                    value={settings.adminExpenses}
                    onChange={(e) => setSettings({ ...settings, adminExpenses: parseFloat(e.target.value) || 0 })}
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-purple-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="TrendingUp" className="h-8 w-8 text-white" />
                    <h3 className="text-white/80 text-sm">Текущий период</h3>
                  </div>
                  <p className="text-3xl font-bold text-white font-mono">
                    {calculations.totalCurrent.toLocaleString('ru-RU')} ₽
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="Calendar" className="h-8 w-8 text-white" />
                    <h3 className="text-white/80 text-sm">Прогноз на год</h3>
                  </div>
                  <p className="text-3xl font-bold text-white font-mono">
                    {calculations.totalNextYear.toLocaleString('ru-RU')} ₽
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600 to-green-800 border-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="Percent" className="h-8 w-8 text-white" />
                    <h3 className="text-white/80 text-sm">Рентабельность</h3>
                  </div>
                  <p className="text-3xl font-bold text-white font-mono">
                    {calculations.profitability.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Детализация по персоналу (прямые затраты)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {calculations.personnelDetails.map((p, idx) => (
                  <div key={idx} className="p-4 bg-slate-900/50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <h4 className="text-purple-400 font-semibold">{p.name} ({p.count} чел.)</h4>
                      <span className="text-white font-mono font-bold">{p.totalCost.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Средняя ЗП:</span>
                        <p className="text-white font-mono">{p.avgSalary.toLocaleString('ru-RU')} ₽</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Ставка/час:</span>
                        <p className="text-white font-mono">{p.hourlyRate.toLocaleString('ru-RU')} ₽</p>
                      </div>
                      <div>
                        <span className="text-slate-400">ФОТ + налоги:</span>
                        <p className="text-white font-mono">{p.costBreakdown.taxes.toLocaleString('ru-RU')} ₽</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Рынок:</span>
                        <p className="text-green-400 font-mono">{p.marketCost.toLocaleString('ru-RU')} ₽</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Separator className="bg-slate-700 my-2" />
                <div className="flex justify-between text-lg font-semibold p-2">
                  <span className="text-slate-200">Итого персонал:</span>
                  <span className="text-purple-400 font-mono">{calculations.personnelDirectCost.toLocaleString('ru-RU')} ₽</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Детализация по оборудованию (полный состав цены)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {calculations.equipmentDetails.map((e, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-blue-400 font-semibold">{e.name} ({e.count} ед.)</span>
                      <span className="text-white font-mono font-bold">{e.finalCost.toLocaleString('ru-RU')} ₽/мес</span>
                    </div>
                    <div className="text-xs space-y-1 pl-4">
                      <div className="flex justify-between text-slate-400">
                        <span>• Трудозатраты ({e.totalHours.toFixed(1)} ч):</span>
                        <span className="font-mono">{e.costBreakdown.labor.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>• Накладные расходы:</span>
                        <span className="font-mono">{e.costBreakdown.overhead.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>• Административные расходы:</span>
                        <span className="font-mono">{e.costBreakdown.admin.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Separator className="bg-slate-700 my-2" />
                <div className="flex justify-between text-lg font-semibold p-2">
                  <span className="text-slate-200">Итого оборудование:</span>
                  <span className="text-blue-400 font-mono">{calculations.totalEquipmentCost.toLocaleString('ru-RU')} ₽</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Дополнительные услуги (полный состав цены)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {calculations.serviceDetails.map((s, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-green-400 font-semibold">{s.name}</span>
                      <span className="text-white font-mono font-bold">{s.finalCost.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="text-xs space-y-1 pl-4">
                      <div className="flex justify-between text-slate-400">
                        <span>• Базовая стоимость:</span>
                        <span className="font-mono">{s.costBreakdown.base.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>• Накладные расходы:</span>
                        <span className="font-mono">{s.costBreakdown.overhead.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>• Административные расходы:</span>
                        <span className="font-mono">{s.costBreakdown.admin.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    </div>
                  </div>
                ))}
                {calculations.serviceDetails.length === 0 && (
                  <p className="text-slate-400 text-center py-4">Дополнительные услуги не выбраны</p>
                )}
                <Separator className="bg-slate-700 my-2" />
                <div className="flex justify-between text-lg font-semibold p-2">
                  <span className="text-slate-200">Итого услуги:</span>
                  <span className="text-green-400 font-mono">{calculations.totalServiceCost.toLocaleString('ru-RU')} ₽</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/30 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Маржа и рентабельность</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-semibold">Маржа</h4>
                    <p className="text-sm text-slate-400">Прибыль от проекта ({settings.margin}%)</p>
                  </div>
                  <span className="text-2xl font-bold text-purple-400 font-mono">
                    {calculations.marginAmount.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-semibold">Рентабельность</h4>
                    <p className="text-sm text-slate-400">Процент прибыли</p>
                  </div>
                  <span className="text-2xl font-bold text-green-400 font-mono">
                    {calculations.profitability.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-900/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Сравнение с рынком</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-semibold text-lg">Разница с рыночной стоимостью</h4>
                    <p className="text-sm text-slate-400 mt-1">Рыночная стоимость: {calculations.marketTotal.toLocaleString('ru-RU')} ₽</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-3xl font-bold font-mono ${calculations.marketDiff < 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {calculations.marketDiff > 0 ? '+' : ''}{calculations.marketDiff.toLocaleString('ru-RU')} ₽
                    </span>
                    <p className="text-sm text-slate-400 mt-1">
                      ({calculations.marketDiffPercent > 0 ? '+' : ''}{calculations.marketDiffPercent.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
