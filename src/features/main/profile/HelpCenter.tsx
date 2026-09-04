import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Search,
  MessageSquare,
  Mail,
  FileText,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react-native';
import { useGetFaqsQuery } from './hooks/useGetFaqsQuery';
import { FaqItem as FaqItemType } from './api/faq-api';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const HighlightText = ({
  text,
  query,
  style,
}: {
  text: string;
  query: string;
  style: any;
}) => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return <Text style={style}>{text}</Text>;
  }

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmedQuery)})`, 'gi'));

  return (
    <Text style={style}>
      {parts.map((part, index) =>
        part.toLowerCase() === trimmedQuery.toLowerCase() ? (
          <Text key={index} style={styles.highlight}>
            {part}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
};

const FAQItem = ({
  item,
  expanded,
  searchQuery,
  onPress,
}: {
  item: FaqItemType;
  expanded: boolean;
  searchQuery: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.faqItem} onPress={onPress}>
    <View style={styles.faqHeader}>
      <HighlightText text={item.question} query={searchQuery} style={styles.faqQuestion} />
      {expanded ? (
        <ChevronUp size={20} color="#1A1A1A" />
      ) : (
        <ChevronDown size={20} color="#1A1A1A" />
      )}
    </View>
    {expanded && (
      <HighlightText text={item.answer} query={searchQuery} style={styles.faqAnswer} />
    )}
  </TouchableOpacity>
);

export const HelpCenter = ({ navigation }: any) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = useGetFaqsQuery();

  const faqs = data?.data?.items ?? [];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const filteredFaqs = isSearching
    ? faqs.filter(
        (item) =>
          item.question.toLowerCase().includes(normalizedQuery) ||
          item.answer.toLowerCase().includes(normalizedQuery),
      )
    : faqs;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <HeaderToolbar
        title="Pusat Bantuan"
        onPressBack={() => navigation.goBack()}
        titlePosition="left"
        titleStyle="medium"
        backgroundColor="#F5F5F7"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchBar}>
          <Search size={20} color="#737373" />
          <TextInput
            placeholder="Cari pertanyaan"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={18} color="#737373" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.menuList}>
          <TouchableOpacity style={styles.menuCard} activeOpacity={0.8}>
            <View style={styles.iconWrap}>
              <MessageSquare size={20} color="#737373" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Chat CS</Text>
              <Text style={styles.menuSubtitle}>Online 24/7</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} activeOpacity={0.8}>
            <View style={styles.iconWrap}>
              <Mail size={20} color="#737373" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Email</Text>
              <Text style={styles.menuSubtitle}>help@doitpay.co</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DisputeReportCenter', { disputeType: 'ALL' })}>
            <View style={styles.iconWrap}>
              <FileText size={20} color="#737373" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Pusat Laporan</Text>
              <Text style={styles.menuSubtitle}>Buat & Cek Laporan</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>PERTANYAAN UMUM</Text>

        {isLoading ? (
          <ActivityIndicator size="small" color="#4F84F6" style={styles.loader} />
        ) : filteredFaqs.length === 0 ? (
          <Text style={styles.emptyText}>Tidak ada pertanyaan yang ditemukan</Text>
        ) : (
          filteredFaqs.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              searchQuery={searchQuery}
              expanded={isSearching || expandedId === item.id}
              onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  headerTitle: { fontFamily: 'Switzer-Semibold', fontSize: 22, color: '#1A1A1A' },
  content: { paddingHorizontal: 20, backgroundColor: '#F5F5F7' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 46,
  },
  searchInput: { flex: 1, fontFamily: 'Switzer-Regular', fontSize: 14, color: '#1A1A1A' },
  menuList: { marginTop: 12 },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  iconWrap: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextWrap: { flex: 1 },
  menuTitle: { fontSize: 16, fontFamily: 'Switzer-Medium', color: '#1A1A1A' },
  menuSubtitle: { fontSize: 12, fontFamily: 'Switzer-Regular', color: '#262626', marginTop: 2 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Switzer-Medium',
    color: '#525252',
    marginTop: 14,
    marginBottom: 2,
  },
  faqItem: { paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { flex: 1, fontSize: 16, fontFamily: 'Switzer-Medium', color: '#1A1A1A' },
  faqAnswer: {
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    color: '#262626',
    marginTop: 12,
    lineHeight: 24,
  },
  loader: { marginTop: 24 },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    color: '#737373',
    textAlign: 'center',
    marginTop: 24,
  },
  highlight: {
    fontFamily: 'Switzer-Bold',
    color: '#1A1A1A',
  },
});
