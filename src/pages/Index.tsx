import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';

// Типы данных
interface Employee {
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
}

interface Settings {
  vat: number;
  priceGrowth: number;
  regionalCoef: number;
  salaryIndexation: number;
  margin: number;
  complexityCoef: number;
  taxLoad: number;
  payrollTax: number;
  overhead: number;
  adminExpenses: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('personnel');

  // Персонал
  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: 'Инженер технической поддержки', count: 2, hours: 160, minSalary: 80000, maxSalary: 120000, marketPrice: 107500, isRemote: false, canBeRemote: true },
    { id: '2', name: 'Системный администратор', count: 1, hours: 160, minSalary: 100000, maxSalary: 150000, marketPrice: 137556, isRemote: false, canBeRemote: true },
    { id: '3', name: 'Сетевой администратор', count: 1, hours: 160, minSalary: 120000, maxSalary: 180000, marketPrice: 160000, isRemote: false, canBeRemote: true },
    { id: '4', name: 'Начальник отдела', count: 1, hours: 160, minSalary: 150000, maxSalary: 200000, marketPrice: 0, isRemote: false, canBeRemote: false },
  ]);

  // Оборудование
  const [equipment, setEquipment] = useState<Equipment[]>([
    // Серверное
    { id: 's1', name: 'Сервер физический', count: 3, category: 'server' },
    { id: 's2', name: 'Сервер виртуальный', count: 10, category: 'server' },
    { id: 's3', name: 'Система хранения данных', count: 2, category: 'server' },
    { id: 's4', name: 'Система резервного копирования', count: 1, category: 'server' },
    { id: 's5', name: 'Серверный ИБП', count: 2, category: 'server' },
    // Сетевое
    { id: 'n1', name: 'Коммутатор', count: 5, category: 'network' },
    { id: 'n2', name: 'Маршрутизатор', count: 2, category: 'network' },
    { id: 'n3', name: 'Межсетевой экран', count: 1, category: 'network' },
    { id: 'n4', name: 'Точка доступа Wi-Fi', count: 8, category: 'network' },
    { id: 'n5', name: 'Прочее сетевое оборудование', count: 3, category: 'network' },
    // Рабочие места
    { id: 'w1', name: 'Рабочая станция', count: 50, category: 'workplace' },
    { id: 'w2', name: 'Ноутбук', count: 20, category: 'workplace' },
    { id: 'w3', name: 'Терминальный клиент', count: 10, category: 'workplace' },
    { id: 'w4', name: 'МФУ', count: 5, category: 'workplace' },
    { id: 'w5', name: 'Принтер А3', count: 2, category: 'workplace' },
    { id: 'w6', name: 'Плоттер', count: 1, category: 'workplace' },
    { id: 'w7', name: 'ИБП для рабочих мест', count: 15, category: 'workplace' },
    { id: 'w8', name: 'Прочее оборудование', count: 5, category: 'workplace' },
  ]);

  // Доп. услуги
  const [services, setServices] = useState({
    monitoring: true,
    backup: true,
    security: false,
    recovery: false,
    sla: 'standard',
    offices: 1,
  });

  // Настройки
  const [settings, setSettings] = useState<Settings>({
    vat: 20,
    priceGrowth: 8,
    regionalCoef: 1.15,
    salaryIndexation: 10,
    margin: 25,
    complexityCoef: 1.2,
    taxLoad: 6,
    payrollTax: 30.2,
    overhead: 15,
    adminExpenses: 10,
  });

  // Расчеты
  const calculations = useMemo(() => {
    // Средняя ЗП начальника отдела = средняя всех специалистов * 1.5
    const avgMarketPrice = (107500 + 137556 + 160000) / 3;
    const headMarketPrice = avgMarketPrice * 1.5;

    const updatedEmployees = employees.map(emp => {
      if (emp.id === '4') {
        return { ...emp, marketPrice: headMarketPrice };
      }
      return emp;
    });

    // Расчет стоимости персонала
    const personnelCost = updatedEmployees.reduce((sum, emp) => {
      const avgSalary = (emp.minSalary + emp.maxSalary) / 2;
      const monthlyCost = avgSalary * emp.count;
      const withTaxes = monthlyCost * (1 + settings.payrollTax / 100);
      const withCoefs = withTaxes * settings.regionalCoef * settings.complexityCoef;
      return sum + withCoefs;
    }, 0);

    // Рыночная стоимость персонала
    const marketPersonnelCost = updatedEmployees.reduce((sum, emp) => {
      return sum + emp.marketPrice * emp.count * settings.regionalCoef;
    }, 0);

    // Стоимость обслуживания оборудования (упрощенный расчет)
    const serverEquipment = equipment.filter(e => e.category === 'server').reduce((s, e) => s + e.count, 0);
    const networkEquipment = equipment.filter(e => e.category === 'network').reduce((s, e) => s + e.count, 0);
    const workplaceEquipment = equipment.filter(e => e.category === 'workplace').reduce((s, e) => s + e.count, 0);

    const equipmentCost = (serverEquipment * 5000 + networkEquipment * 3000 + workplaceEquipment * 1000) * settings.complexityCoef;

    // Доп услуги
    const servicesCost = 
      (services.monitoring ? serverEquipment + networkEquipment : 0) * 2000 +
      (services.backup ? 15000 : 0) +
      (services.security ? 25000 : 0) +
      (services.recovery ? 30000 : 0) +
      (services.sla === 'premium' ? 50000 : services.sla === 'business' ? 30000 : 10000) +
      (services.offices - 1) * 20000;

    // Итого базовая стоимость
    const baseCost = personnelCost + equipmentCost + servicesCost;
    
    // С накладными расходами
    const withOverhead = baseCost * (1 + settings.overhead / 100);
    
    // С админ расходами
    const withAdmin = withOverhead * (1 + settings.adminExpenses / 100);
    
    // С маржой
    const withMargin = withAdmin * (1 + settings.margin / 100);
    
    // С НДС
    const totalCurrent = withMargin * (1 + settings.vat / 100);

    // Прогноз на следующий год
    const nextYearPersonnel = personnelCost * (1 + settings.salaryIndexation / 100);
    const nextYearServices = (equipmentCost + servicesCost) * (1 + settings.priceGrowth / 100);
    const nextYearBase = nextYearPersonnel + nextYearServices;
    const nextYearWithOverhead = nextYearBase * (1 + settings.overhead / 100);
    const nextYearWithAdmin = nextYearWithOverhead * (1 + settings.adminExpenses / 100);
    const nextYearWithMargin = nextYearWithAdmin * (1 + settings.margin / 100);
    const totalNextYear = nextYearWithMargin * (1 + settings.vat / 100);

    // Маржа и рентабельность
    const marginAmount = withMargin - withAdmin;
    const profitability = (marginAmount / withAdmin) * 100;

    // Разница с рынком
    const marketTotal = (marketPersonnelCost + equipmentCost + servicesCost) * (1 + settings.vat / 100);
    const marketDiff = totalCurrent - marketTotal;
    const marketDiffPercent = (marketDiff / marketTotal) * 100;

    return {
      personnelCost,
      equipmentCost,
      servicesCost,
      baseCost,
      totalCurrent,
      totalNextYear,
      marginAmount,
      profitability,
      marketTotal,
      marketDiff,
      marketDiffPercent,
      updatedEmployees,
      serverEquipment,
      networkEquipment,
      workplaceEquipment,
    };
  }, [employees, equipment, services, settings]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Калькулятор стоимости ИТ-поддержки</h1>
          <p className="text-slate-400">Расчет стоимости сопровождения ИТ-инфраструктуры с прогнозом на следующий год</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full bg-slate-800/50 p-1">
            <TabsTrigger value="personnel" className="data-[state=active]:bg-purple-600">
              <Icon name="Users" className="mr-2 h-4 w-4" />
              Персонал
            </TabsTrigger>
            <TabsTrigger value="equipment" className="data-[state=active]:bg-purple-600">
              <Icon name="Server" className="mr-2 h-4 w-4" />
              Оборудование
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-purple-600">
              <Icon name="Briefcase" className="mr-2 h-4 w-4" />
              Доп. услуги
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
              <Icon name="Settings" className="mr-2 h-4 w-4" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-purple-600">
              <Icon name="BarChart3" className="mr-2 h-4 w-4" />
              Результат
            </TabsTrigger>
          </TabsList>

          {/* Персонал */}
          <TabsContent value="personnel" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Users" className="h-5 w-5 text-purple-400" />
                  Специалисты по направлениям
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {calculations.updatedEmployees.map((emp, idx) => (
                  <div key={emp.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{emp.name}</h3>
                      {emp.canBeRemote && (
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-slate-400">Удаленный</Label>
                          <Switch
                            checked={emp.isRemote}
                            onCheckedChange={(checked) => {
                              const newEmployees = [...employees];
                              newEmployees[idx].isRemote = checked;
                              setEmployees(newEmployees);
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-slate-400">Количество</Label>
                        <Input
                          type="number"
                          value={emp.count}
                          onChange={(e) => {
                            const newEmployees = [...employees];
                            newEmployees[idx].count = parseInt(e.target.value) || 0;
                            setEmployees(newEmployees);
                          }}
                          className="bg-slate-800 border-slate-600 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-400">Часы/месяц</Label>
                        <Input
                          type="number"
                          value={emp.hours}
                          onChange={(e) => {
                            const newEmployees = [...employees];
                            newEmployees[idx].hours = parseInt(e.target.value) || 0;
                            setEmployees(newEmployees);
                          }}
                          className="bg-slate-800 border-slate-600 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-400">Мин. ЗП (₽)</Label>
                        <Input
                          type="number"
                          value={emp.minSalary}
                          onChange={(e) => {
                            const newEmployees = [...employees];
                            newEmployees[idx].minSalary = parseInt(e.target.value) || 0;
                            setEmployees(newEmployees);
                          }}
                          className="bg-slate-800 border-slate-600 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-400">Макс. ЗП (₽)</Label>
                        <Input
                          type="number"
                          value={emp.maxSalary}
                          onChange={(e) => {
                            const newEmployees = [...employees];
                            newEmployees[idx].maxSalary = parseInt(e.target.value) || 0;
                            setEmployees(newEmployees);
                          }}
                          className="bg-slate-800 border-slate-600 text-white mt-1"
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Средняя рыночная стоимость:</span>
                        <span className="text-lg font-mono text-purple-400">
                          {emp.marketPrice.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-slate-400">Средняя ЗП в проекте:</span>
                        <span className="text-lg font-mono text-white">
                          {((emp.minSalary + emp.maxSalary) / 2).toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Оборудование */}
          <TabsContent value="equipment" className="space-y-4">
            {/* Серверное */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Server" className="h-5 w-5 text-purple-400" />
                  Серверное оборудование
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipment.filter(e => e.category === 'server').map((item, idx) => {
                  const globalIdx = equipment.findIndex(e => e.id === item.id);
                  return (
                    <div key={item.id} className="p-3 bg-slate-900/50 rounded border border-slate-700">
                      <Label className="text-slate-300 text-sm">{item.name}</Label>
                      <Input
                        type="number"
                        value={item.count}
                        onChange={(e) => {
                          const newEquipment = [...equipment];
                          newEquipment[globalIdx].count = parseInt(e.target.value) || 0;
                          setEquipment(newEquipment);
                        }}
                        className="bg-slate-800 border-slate-600 text-white mt-2"
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Сетевое */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Network" className="h-5 w-5 text-blue-400" />
                  Сетевое оборудование
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipment.filter(e => e.category === 'network').map((item) => {
                  const globalIdx = equipment.findIndex(e => e.id === item.id);
                  return (
                    <div key={item.id} className="p-3 bg-slate-900/50 rounded border border-slate-700">
                      <Label className="text-slate-300 text-sm">{item.name}</Label>
                      <Input
                        type="number"
                        value={item.count}
                        onChange={(e) => {
                          const newEquipment = [...equipment];
                          newEquipment[globalIdx].count = parseInt(e.target.value) || 0;
                          setEquipment(newEquipment);
                        }}
                        className="bg-slate-800 border-slate-600 text-white mt-2"
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Рабочие места */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Monitor" className="h-5 w-5 text-green-400" />
                  Рабочие места и периферия
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipment.filter(e => e.category === 'workplace').map((item) => {
                  const globalIdx = equipment.findIndex(e => e.id === item.id);
                  return (
                    <div key={item.id} className="p-3 bg-slate-900/50 rounded border border-slate-700">
                      <Label className="text-slate-300 text-sm">{item.name}</Label>
                      <Input
                        type="number"
                        value={item.count}
                        onChange={(e) => {
                          const newEquipment = [...equipment];
                          newEquipment[globalIdx].count = parseInt(e.target.value) || 0;
                          setEquipment(newEquipment);
                        }}
                        className="bg-slate-800 border-slate-600 text-white mt-2"
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Доп. услуги */}
          <TabsContent value="services" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Briefcase" className="h-5 w-5 text-purple-400" />
                  Дополнительные услуги
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Мониторинг ИТ-инфраструктуры</h4>
                    <p className="text-sm text-slate-400">Автоматический мониторинг серверов и сетевого оборудования</p>
                  </div>
                  <Switch
                    checked={services.monitoring}
                    onCheckedChange={(checked) => setServices({ ...services, monitoring: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Управление резервным копированием</h4>
                    <p className="text-sm text-slate-400">Настройка, мониторинг и управление системами</p>
                  </div>
                  <Switch
                    checked={services.backup}
                    onCheckedChange={(checked) => setServices({ ...services, backup: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Регулярный аудит безопасности</h4>
                    <p className="text-sm text-slate-400">Периодическая проверка систем безопасности</p>
                  </div>
                  <Switch
                    checked={services.security}
                    onCheckedChange={(checked) => setServices({ ...services, security: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">План аварийного восстановления</h4>
                    <p className="text-sm text-slate-400">Разработка и поддержка плана</p>
                  </div>
                  <Switch
                    checked={services.recovery}
                    onCheckedChange={(checked) => setServices({ ...services, recovery: checked })}
                  />
                </div>

                <Separator className="bg-slate-700" />

                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <Label className="text-white font-medium">Уровень обслуживания SLA</Label>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {['standard', 'business', 'premium'].map((level) => (
                      <Button
                        key={level}
                        variant={services.sla === level ? 'default' : 'outline'}
                        onClick={() => setServices({ ...services, sla: level })}
                        className={services.sla === level ? 'bg-purple-600' : 'border-slate-600 text-slate-300'}
                      >
                        {level === 'standard' ? 'Стандарт' : level === 'business' ? 'Бизнес' : 'Премиум'}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <Label className="text-white font-medium">Количество офисов</Label>
                  <Input
                    type="number"
                    value={services.offices}
                    onChange={(e) => setServices({ ...services, offices: parseInt(e.target.value) || 1 })}
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                    min={1}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Настройки */}
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
                  <Label className="text-slate-300">Прогноз индексации зарплат (%)</Label>
                  <Input
                    type="number"
                    value={settings.salaryIndexation}
                    onChange={(e) => setSettings({ ...settings, salaryIndexation: parseFloat(e.target.value) || 0 })}
                    className="bg-slate-800 border-slate-600 text-white mt-2"
                  />
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
                  <Label className="text-slate-300">Административные расходы (%)</Label>
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

          {/* Результат */}
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
                <CardTitle className="text-white">Детализация расчета</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <h4 className="text-purple-400 font-semibold mb-3">Персонал</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Стоимость персонала с налогами:</span>
                      <span className="text-white font-mono">{calculations.personnelCost.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <h4 className="text-blue-400 font-semibold mb-3">Оборудование</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Серверное ({calculations.serverEquipment} ед.):</span>
                      <span className="text-white font-mono">{(calculations.serverEquipment * 5000).toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Сетевое ({calculations.networkEquipment} ед.):</span>
                      <span className="text-white font-mono">{(calculations.networkEquipment * 3000).toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Рабочие места ({calculations.workplaceEquipment} ед.):</span>
                      <span className="text-white font-mono">{(calculations.workplaceEquipment * 1000).toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <Separator className="bg-slate-700 my-2" />
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-slate-300">Итого оборудование:</span>
                      <span className="text-white font-mono">{calculations.equipmentCost.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <h4 className="text-green-400 font-semibold mb-3">Доп. услуги</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Стоимость услуг:</span>
                      <span className="text-white font-mono">{calculations.servicesCost.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-semibold">Маржа</h4>
                      <p className="text-sm text-slate-400">Прибыль от проекта</p>
                    </div>
                    <span className="text-2xl font-bold text-purple-400 font-mono">
                      {calculations.marginAmount.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-semibold">Разница с рынком</h4>
                      <p className="text-sm text-slate-400">Рыночная стоимость: {calculations.marketTotal.toLocaleString('ru-RU')} ₽</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold font-mono ${calculations.marketDiff < 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {calculations.marketDiff > 0 ? '+' : ''}{calculations.marketDiff.toLocaleString('ru-RU')} ₽
                      </span>
                      <p className="text-sm text-slate-400 mt-1">
                        ({calculations.marketDiffPercent > 0 ? '+' : ''}{calculations.marketDiffPercent.toFixed(1)}%)
                      </p>
                    </div>
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
