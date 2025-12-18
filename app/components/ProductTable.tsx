import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScoreGauge } from './ScoreGauge';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { RatingBadge } from './RatingBadge';
import { PhaseBadge } from './PhaseBadge';
import { PillarCard } from './PillarCard';
import { type Product, getRatingLabel, PHASE_LABELS } from '@/types/product';
import { ArrowUpDown, Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
}

type SortField = 'name' | 'nsr' | 'ci' | 'phase';
type SortDirection = 'asc' | 'desc';

export function ProductTable({ products }: ProductTableProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [labelFilter, setLabelFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('nsr');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
      );
    }

    // Phase filter
    if (phaseFilter !== 'all') {
      result = result.filter(p => p.phase.toString() === phaseFilter);
    }

    // Label filter
    if (labelFilter !== 'all') {
      result = result.filter(p => 
        p.latestRating && getRatingLabel(p.latestRating.nsr) === labelFilter
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      switch (sortField) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'nsr':
          aVal = a.latestRating?.nsr ?? 0;
          bVal = b.latestRating?.nsr ?? 0;
          break;
        case 'ci':
          aVal = a.latestRating?.confidenceIndex ?? 0;
          bVal = b.latestRating?.confidenceIndex ?? 0;
          break;
        case 'phase':
          aVal = a.phase;
          bVal = b.phase;
          break;
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }

      return sortDirection === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
    });

    return result;
  }, [products, search, phaseFilter, labelFilter, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => toggleSort(field)}
    >
      {children}
      <ArrowUpDown className={cn(
        'ml-2 h-4 w-4',
        sortField === field && 'text-foreground'
      )} />
    </Button>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={phaseFilter} onValueChange={setPhaseFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Phase" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Phases</SelectItem>
            <SelectItem value="0">Idea</SelectItem>
            <SelectItem value="1">Early Live</SelectItem>
            <SelectItem value="2">Mature</SelectItem>
          </SelectContent>
        </Select>
        <Select value={labelFilter} onValueChange={setLabelFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Label" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Labels</SelectItem>
            <SelectItem value="Scale">Scale</SelectItem>
            <SelectItem value="Defend">Defend</SelectItem>
            <SelectItem value="Test">Test</SelectItem>
            <SelectItem value="Retire">Retire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <SortButton field="name">Product</SortButton>
              </TableHead>
              <TableHead className="w-[100px]">
                <SortButton field="phase">Phase</SortButton>
              </TableHead>
              <TableHead className="w-[120px]">
                <SortButton field="nsr">NSR</SortButton>
              </TableHead>
              <TableHead className="w-[140px]">
                <SortButton field="ci">Confidence</SortButton>
              </TableHead>
              <TableHead>Pillars</TableHead>
              <TableHead className="w-[100px]">Label</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => {
              const rating = product.latestRating;
              if (!rating) return null;

              return (
                <TableRow 
                  key={product.id} 
                  className="group cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <PhaseBadge phase={product.phase} />
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      'text-xl font-bold font-mono',
                      rating.nsr >= 750 && 'text-rating-scale',
                      rating.nsr >= 600 && rating.nsr < 750 && 'text-rating-defend',
                      rating.nsr >= 450 && rating.nsr < 600 && 'text-rating-test',
                      rating.nsr < 450 && 'text-rating-retire',
                    )}>
                      {rating.nsr}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ConfidenceIndicator value={rating.confidenceIndex} size="sm" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <PillarCard pillar="dv" score={rating.pillarScores.dv} compact />
                      <PillarCard pillar="ro" score={rating.pillarScores.ro} compact />
                      <PillarCard pillar="ue" score={rating.pillarScores.ue} compact />
                      <PillarCard pillar="lp" score={rating.pillarScores.lp} compact />
                    </div>
                  </TableCell>
                  <TableCell>
                    <RatingBadge score={rating.nsr} />
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No products found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
